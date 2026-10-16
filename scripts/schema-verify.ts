import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();
async function main() {
  console.log('=== Garjane News - Read-only Schema Verification ===');
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const schemaText = fs.readFileSync(schemaPath, 'utf-8');
  const models = new Map<string, string[]>();
  const modelRegex = /model\s+(\w+)\s*{([^}]*)}/gs;
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/gs;
  let m: RegExpExecArray | null;
  while ((m = modelRegex.exec(schemaText))) {
    const name = m[1];
    const body = m[2];
    const fields = body.split('\n').map(l=>l.trim()).filter(l=> l && !l.startsWith('@@') && !l.startsWith('//'));
    models.set(name, fields.map(l=> l.split(/\s+/)[0]));
  }
  const enums = new Map<string, string[]>();
  while ((m = enumRegex.exec(schemaText))) {
    enums.set(m[1], m[2].split('\n').map(l=>l.trim()).filter(Boolean));
  }
  console.log(`Parsed schema.prisma: ${models.size} models, ${enums.size} enums`);
  for (const [k,v] of enums) console.log(`  enum ${k}: ${v.join(', ')}`);
  console.log();
  try {
    const tables = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`) as {table_name:string}[];
    const tNames = tables.map(t=>t.table_name);
    console.log(`Live DB tables (${tNames.length}): ${tNames.join(', ')}`);
    const missing = Array.from(models.keys()).filter(k=> !tNames.includes(k));
    const extra = tNames.filter(t=> !models.has(t));
    console.log(`Missing in DB: ${missing.length? missing.join(', '): 'none'}`);
    console.log(`Extra in DB: ${extra.length? extra.join(', '): 'none'}`);
    console.log();
    const cols = await prisma.$queryRawUnsafe(`SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position`) as any[];
    const byTable = new Map<string, any[]>();
    for (const c of cols) { if (!byTable.has(c.table_name)) byTable.set(c.table_name, []); byTable.get(c.table_name)!.push(c); }
    console.log(`Columns total ${cols.length}:`);
    for (const [tbl, cs] of byTable) console.log(`  ${tbl} (${cs.length}): ${cs.map((c:any)=> `${c.column_name}(${c.udt_name}${c.is_nullable==='YES'?' nullable':''})`).join(', ')}`);
    console.log();
    const enumRows = await prisma.$queryRawUnsafe(`SELECT t.typname as enum_name, e.enumlabel as label FROM pg_type t JOIN pg_enum e ON t.oid=e.enumtypid JOIN pg_namespace n ON t.typnamespace=n.oid WHERE n.nspname='public' ORDER BY t.typname, e.enumsortorder`) as {enum_name:string,label:string}[];
    const liveEnums = new Map<string,string[]>();
    for (const r of enumRows){ if(!liveEnums.has(r.enum_name)) liveEnums.set(r.enum_name,[]); liveEnums.get(r.enum_name)!.push(r.label); }
    console.log(`Live enums (${liveEnums.size}):`); for (const [k,v] of liveEnums) console.log(`  ${k}: ${v.join(', ')}`);
    const mism: string[]=[]; for (const [k,v] of enums){ const live=liveEnums.get(k); if(!live) mism.push(`Enum ${k} missing`); else if(live.join(',')!==v.join(',')) mism.push(`Enum ${k} mismatch schema[${v.join(',')}] vs DB[${live.join(',')}]`);} for(const k of liveEnums.keys()) if(!enums.has(k)) mism.push(`Extra enum ${k} in DB`);
    console.log(mism.length? `Enum mismatches: ${mism.join(' | ')}` : 'Enums: MATCH');
    console.log();
    const idxs = await prisma.$queryRawUnsafe(`SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname='public' ORDER BY tablename, indexname`) as any[];
    console.log(`Live indexes (${idxs.length}):`); for(const i of idxs) console.log(`  ${i.tablename}.${i.indexname}: ${i.indexdef}`);
    console.log();
    const fks = await prisma.$queryRawUnsafe(`SELECT tc.table_name, tc.constraint_name, kcu.column_name, ccu.table_name as foreign_table_name, ccu.column_name as foreign_column_name, rc.delete_rule FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.table_schema=kcu.table_schema JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name=tc.constraint_name JOIN information_schema.referential_constraints rc ON tc.constraint_name=rc.constraint_name WHERE tc.constraint_type='FOREIGN KEY' AND tc.table_schema='public' ORDER BY tc.table_name`) as any[];
    console.log(`Live FKs (${fks.length}):`); for(const fk of fks) console.log(`  ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (${fk.constraint_name} ${fk.delete_rule})`);
    console.log();
    const cons = await prisma.$queryRawUnsafe(`SELECT conname, conrelid::regclass::text as table_name, contype, pg_get_constraintdef(oid) as def FROM pg_constraint WHERE connamespace='public'::regnamespace ORDER BY conrelid, conname`) as any[];
    console.log(`pg_constraints (${cons.length}):`); for(const c of cons) console.log(`  ${c.table_name} ${c.conname} [${c.contype}] ${c.def}`);
    console.log(); console.log('=== SUMMARY ===');
    console.log(`Tables: ${missing.length===0 && extra.length===0 ? 'MATCH' : 'MISMATCH'}`);
    console.log(`Enums: ${mism.length===0? 'MATCH':'MISMATCH'}`);
    console.log(`Columns: ${cols.length} total | Indexes: ${idxs.length} | FKs: ${fks.length}`);
    if(missing.length===0 && extra.length===0 && mism.length===0) console.log('RESULT: Catalog-level sync. No db push needed without user approval.');
    else console.log('RESULT: Differences detected. Do NOT run prisma db push without approval.');
  } catch(e:any){ console.error('SCHEMA_VERIFY_ERROR', String(e.message).slice(0,1500)); process.exit(1);} finally{ await prisma.$disconnect(); }
}
main();
