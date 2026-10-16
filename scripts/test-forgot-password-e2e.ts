import * as fs from 'fs';
import * as path from 'path';

// Load .env
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {}

import { prisma } from '../src/lib/prisma';
import {
  hashPassword,
  verifyPassword,
  createPasswordResetToken,
  verifyPasswordResetToken,
  createSession,
  getSession,
} from '../src/lib/auth';
import { forgotPasswordAction, resetPasswordAction, verifyResetTokenAction, loginAction } from '../src/actions/auth';
import { sendPasswordResetEmail } from '../src/lib/email';
import { translations } from '../src/lib/translations';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, details?: string, error?: string) {
  results.push({ name, passed, details, error });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${details ? ` (${details})` : ''}${error ? `\n   Error: ${error}` : ''}`);
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('   GARJANE NEWS - FORGOT PASSWORD FEATURE TEST SUITE   ');
  console.log('======================================================\n');

  // --- UNIT TEST 1: Translations ---
  try {
    const hasKn = Boolean(translations.kn.auth.forgotPassword && translations.kn.auth.resetPasswordTitle);
    const hasHi = Boolean(translations.hi.auth.forgotPassword && translations.hi.auth.resetPasswordTitle);
    const hasEn = Boolean(translations.en.auth.forgotPassword && translations.en.auth.resetPasswordTitle);
    const passed = hasKn && hasHi && hasEn;
    record(
      'Multi-language translation coverage (KN, HI, EN)',
      passed,
      `KN: "${translations.kn.auth.forgotPassword}", HI: "${translations.hi.auth.forgotPassword}", EN: "${translations.en.auth.forgotPassword}"`
    );
  } catch (err: any) {
    record('Multi-language translation coverage', false, undefined, err.message);
  }

  // --- UNIT TEST 2: Email formatting and link generation ---
  try {
    const testResetUrl = 'https://garjane-news.vercel.app/reset-password?token=test_token_123';
    const emailResult = await sendPasswordResetEmail({
      to: 'test-recipient@example.com',
      name: 'Test User',
      resetUrl: testResetUrl,
      language: 'kn',
    });
    record(
      'Password reset email generator with reset link and diagnostic categorization',
      emailResult.category === 'SMTP_CONFIG_MISSING' || emailResult.success === true,
      emailResult.success ? 'Dispatched via SMTP' : `Correctly categorized as ${emailResult.category}`
    );
  } catch (err: any) {
    record('Password reset email generator', false, undefined, err.message);
  }

  // --- UNIT TEST 3: Validation on forgot password action ---
  try {
    const invalidForm = new FormData();
    invalidForm.set('email', 'not-a-valid-email');
    const resInvalid = await forgotPasswordAction(invalidForm);
    const passed = Boolean(resInvalid && resInvalid.error);
    record('Forgot password rejects invalid email format', passed, resInvalid?.error);
  } catch (err: any) {
    record('Forgot password rejects invalid email format', false, undefined, err.message);
  }

  // --- UNIT TEST 4: Anti-enumeration security check ---
  try {
    const randomForm = new FormData();
    randomForm.set('email', 'non-existent-user-999999@example.com');
    const resRandom = await forgotPasswordAction(randomForm);
    // Must succeed without revealing whether email exists
    const passed = resRandom?.success === true && resRandom?.message === 'REQUEST_ACCEPTED';
    record(
      'Anti-user-enumeration on forgotPasswordAction',
      passed,
      'Returns generic accepted response for unregistered emails'
    );
  } catch (err: any) {
    record('Anti-user-enumeration on forgotPasswordAction', false, undefined, err.message);
  }

  // --- UNIT TEST 5: Password validation on reset password action ---
  try {
    // Too short password (< 8 chars)
    const shortForm = new FormData();
    shortForm.set('token', 'some_token');
    shortForm.set('password', 'short');
    shortForm.set('confirmPassword', 'short');
    const resShort = await resetPasswordAction(shortForm);

    // Mismatched passwords
    const mismatchForm = new FormData();
    mismatchForm.set('token', 'some_token');
    mismatchForm.set('password', 'ValidPassword123!');
    mismatchForm.set('confirmPassword', 'DifferentPassword123!');
    const resMismatch = await resetPasswordAction(mismatchForm);

    const passed = Boolean(resShort?.error && resMismatch?.error);
    record('Reset password rejects passwords < 8 chars and mismatches', passed);
  } catch (err: any) {
    record('Reset password rejects passwords < 8 chars and mismatches', false, undefined, err.message);
  }

  // --- UNIT TEST 6: Invalid and Malformed Tokens ---
  try {
    const verifyEmpty = await verifyResetTokenAction('');
    const verifyGarbage = await verifyResetTokenAction('invalid.jwt.token.here');
    const passed = verifyEmpty.valid === false && verifyGarbage.valid === false;
    record('Safely handles malformed and empty reset tokens', passed);
  } catch (err: any) {
    record('Safely handles malformed and empty reset tokens', false, undefined, err.message);
  }

  // --- INTEGRATION TEST: Full Lifecycle with Database User ---
  const TEST_EMAIL = `test-pwd-reset-${Date.now()}@example.com`;
  const INITIAL_PASSWORD = 'InitialPassword123!';
  const NEW_PASSWORD = 'BrandNewPassword456!';
  let createdUserId: string | null = null;

  try {
    const initialHash = await hashPassword(INITIAL_PASSWORD);
    const testUser = await prisma.user.create({
      data: {
        email: TEST_EMAIL,
        name: 'Reset Test User',
        passwordHash: initialHash,
        role: 'VIEWER',
      },
    });
    createdUserId = testUser.id;
    record('Integration: Created test user in database', true, `User ID: ${testUser.id}`);

    // Step A: Request password reset
    const forgotForm = new FormData();
    forgotForm.set('email', TEST_EMAIL);
    forgotForm.set('language', 'kn');
    const forgotRes = await forgotPasswordAction(forgotForm);
    record('Integration: Requested password reset', forgotRes.success === true);

    // Step B: Generate token directly for the user (same mechanism as forgotPasswordAction)
    const resetToken = await createPasswordResetToken({
      id: testUser.id,
      email: testUser.email,
      passwordHash: testUser.passwordHash,
    });
    record('Integration: Generated secure signed reset token', Boolean(resetToken && resetToken.length > 50));

    // Step C: Verify the token
    const verifyRes = await verifyResetTokenAction(resetToken);
    record('Integration: Verified token is valid', verifyRes.valid === true && verifyRes.email === TEST_EMAIL);

    // Step D: Execute resetPasswordAction with the token
    const resetForm = new FormData();
    resetForm.set('token', resetToken);
    resetForm.set('password', NEW_PASSWORD);
    resetForm.set('confirmPassword', NEW_PASSWORD);
    const resetRes = await resetPasswordAction(resetForm);
    record('Integration: Saved new password via resetPasswordAction', resetRes.success === true);

    // Step E: Fetch updated user from DB
    const updatedUser = await prisma.user.findUnique({ where: { id: testUser.id } });
    if (!updatedUser) throw new Error('User not found after update');

    // Step F: Verify old password fails
    const oldPasswordWorks = await verifyPassword(INITIAL_PASSWORD, updatedUser.passwordHash);
    record('Integration: Old password NO LONGER works', oldPasswordWorks === false);

    // Step G: Verify new password succeeds
    const newPasswordWorks = await verifyPassword(NEW_PASSWORD, updatedUser.passwordHash);
    record('Integration: New password works successfully', newPasswordWorks === true);

    // Step H: Verify the USED token is now INVALID (cannot be reused)
    const reuseAttempt = await verifyResetTokenAction(resetToken);
    record(
      'Integration: Used reset token is IMMEDIATELY invalidated (Single-use security)',
      reuseAttempt.valid === false,
      `Error: ${reuseAttempt.error}`
    );

    // Step I: Attempt to reset again with the same token
    const secondResetForm = new FormData();
    secondResetForm.set('token', resetToken);
    secondResetForm.set('password', 'AnotherPassword789!');
    secondResetForm.set('confirmPassword', 'AnotherPassword789!');
    const secondResetRes = await resetPasswordAction(secondResetForm);
    record(
      'Integration: Re-using the same token to change password is REJECTED',
      Boolean(secondResetRes.error),
      secondResetRes.error
    );

  } catch (err: any) {
    record('Integration test lifecycle', false, undefined, err.message);
  } finally {
    // Cleanup test user
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } });
        console.log(`\n🧹 Cleaned up test user: ${createdUserId}`);
      } catch (e: any) {
        console.warn(`Failed to cleanup test user: ${e.message}`);
      }
    }
  }

  console.log('\n======================================================');
  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passCount} | FAILED: ${results.length - passCount}`);
  console.log(`OVERALL STATUS: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
  console.log('======================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
