import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
  dbAvailable: boolean | null;
  lastDbCheck: number;
};

// Check if DATABASE_URL is provided in the environment
const databaseUrl = process.env.DATABASE_URL?.trim();
const hasDatabaseUrl = Boolean(databaseUrl && databaseUrl.length > 0);

// Only initialize PrismaClient if DATABASE_URL is explicitly configured
let rawPrisma: PrismaClient | null = null;
if (hasDatabaseUrl && databaseUrl) {
  try {
    // Ensure a fast 2-second connection timeout if not already specified to prevent TCP hanging
    let configuredUrl = databaseUrl;
    if (!configuredUrl.includes('connect_timeout=')) {
      configuredUrl += (configuredUrl.includes('?') ? '&' : '?') + 'connect_timeout=2';
    }

    rawPrisma =
      globalForPrisma.prisma ??
      new PrismaClient({
        datasources: {
          db: {
            url: configuredUrl,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
      });
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = rawPrisma;
    }
  } catch {
    rawPrisma = null;
  }
}

// Circuit-breaker to avoid multi-second TCP timeouts when database is offline
const DB_CHECK_INTERVAL_MS = 15_000;

function isDbCircuitOpen(): boolean {
  if (!hasDatabaseUrl || !rawPrisma) {
    return true; // No DATABASE_URL or client initialization failed
  }
  if (globalForPrisma.dbAvailable === false) {
    const now = Date.now();
    if (now - (globalForPrisma.lastDbCheck || 0) < DB_CHECK_INTERVAL_MS) {
      return true;
    }
    globalForPrisma.dbAvailable = null;
  }
  return false;
}

function markDbFailed() {
  globalForPrisma.dbAvailable = false;
  globalForPrisma.lastDbCheck = Date.now();
}

function markDbSuccess() {
  globalForPrisma.dbAvailable = true;
  globalForPrisma.lastDbCheck = Date.now();
}

// Proxy wrapper that transparently throws when offline so callers fall back to mock data safely
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (isDbCircuitOpen() || !rawPrisma) {
      // Return a model delegate proxy where any query throws immediately
      return new Proxy(
        {},
        {
          get(_modelTarget, modelProp) {
            if (modelProp === 'then') return undefined; // Avoid Promise-like resolution issues
            return async () => {
              throw new Error(
                hasDatabaseUrl
                  ? 'Database server is unreachable. Operating in fallback mode.'
                  : 'DATABASE_URL environment variable is not configured. Operating in fallback mode.'
              );
            };
          },
        }
      );
    }

    const orig = Reflect.get(rawPrisma, prop, receiver);
    if (typeof orig === 'object' && orig !== null) {
      return new Proxy(orig, {
        get(modelTarget, modelProp, modelReceiver) {
          const modelFn = Reflect.get(modelTarget, modelProp, modelReceiver);
          if (typeof modelFn === 'function') {
            return async (...args: unknown[]) => {
              if (isDbCircuitOpen()) {
                throw new Error('Database server is unreachable. Operating in fallback mode.');
              }
              try {
                const result = await (modelFn as (...a: unknown[]) => Promise<unknown>).apply(modelTarget, args);
                markDbSuccess();
                return result;
              } catch (err) {
                markDbFailed();
                throw err;
              }
            };
          }
          return modelFn;
        },
      });
    }

    if (typeof orig === 'function') {
      return async (...args: unknown[]) => {
        if (isDbCircuitOpen()) {
          throw new Error('Database server is unreachable. Operating in fallback mode.');
        }
        try {
          const result = await (orig as (...a: unknown[]) => Promise<unknown>).apply(rawPrisma, args);
          markDbSuccess();
          return result;
        } catch (err) {
          markDbFailed();
          throw err;
        }
      };
    }

    return orig;
  },
}) as PrismaClient;

export async function isDatabaseConnected(): Promise<boolean> {
  if (!hasDatabaseUrl || !rawPrisma) {
    return false;
  }

  const now = Date.now();
  if (
    globalForPrisma.dbAvailable !== null &&
    globalForPrisma.dbAvailable !== undefined &&
    now - (globalForPrisma.lastDbCheck || 0) < DB_CHECK_INTERVAL_MS
  ) {
    return globalForPrisma.dbAvailable;
  }

  try {
    await rawPrisma.$queryRaw`SELECT 1`;
    markDbSuccess();
    return true;
  } catch {
    markDbFailed();
    return false;
  }
}

export default prisma;