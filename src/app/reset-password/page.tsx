"use client";

import { useState } from "react";
import Link from "next/link";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ↓↓↓ Replace this with your real dictionary lookup ↓↓↓
  const dictionary = {
    title: "Set New Password",
    subtitle: "Please enter a new strong password for your account.",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    resetButton: "Reset Password",
    backToSignIn: "Back to Sign In",
    showPassword: "Show password",
    hidePassword: "Hide password",
    lengthError: "Password must be at least 8 characters.",
    matchError: "Passwords do not match.",
    strength: {
      empty: "Enter a password",
      veryWeak: "Very Weak",
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
      veryStrong: "Very Strong",
    },
    passwordStrength: {
      goodJob: "good job!",
      meterLabel: "Password strength",
      iconLabel: "Password strength indicator",
      announcement: "Password strength changed to",
    },
  };

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    password.length >= 8 && password === confirm;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ↓↓↓ Your existing submit logic here ↓↓↓
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:py-16">
      {/* ↓↓↓ Keep your existing header / nav above the card ↓↓↓ */}

      <section className="mx-auto w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex flex-col items-center text-center">
          {/* Your logo */}
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {dictionary.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {dictionary.subtitle}
          </p>
        </header>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* ────────── NEW PASSWORD ────────── */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {dictionary.newPasswordLabel}
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                <LockIcon />
              </div>
              <input
                id="new-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={tooShort || undefined}
                className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400 ${tooShort
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-slate-300 focus:border-[#0e2238] focus:ring-[#0e2238] dark:border-slate-700 dark:focus:border-white dark:focus:ring-white"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? dictionary.hidePassword : dictionary.showPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* ────────── PASSWORD STRENGTH METER ────────── */}
            <PasswordStrengthMeter
              password={password}
              labels={dictionary.strength}
              goodJobLabel={dictionary.passwordStrength.goodJob}
              meterLabel={dictionary.passwordStrength.meterLabel}
              iconLabel={dictionary.passwordStrength.iconLabel}
              announcement={dictionary.passwordStrength.announcement}
            />

            {tooShort && (
              <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {dictionary.lengthError}
              </p>
            )}
          </div>

          {/* ────────── CONFIRM PASSWORD ────────── */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {dictionary.confirmPasswordLabel}
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                <LockIcon />
              </div>
              <input
                id="confirm-password"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={mismatch || undefined}
                className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400 ${mismatch
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-slate-300 focus:border-[#0e2238] focus:ring-[#0e2238] dark:border-slate-700 dark:focus:border-white dark:focus:ring-white"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? dictionary.hidePassword : dictionary.showPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {mismatch && (
              <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {dictionary.matchError}
              </p>
            )}
          </div>

          {/* ────────── SUBMIT ────────── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8102e] px-4 py-3 text-base font-semibold text-white shadow-[0_8px_20px_rgba(200,16,46,0.25)] transition-colors hover:bg-[#a40d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            <span>{dictionary.resetButton}</span>
            <ArrowRight />
          </button>

          <div className="border-t border-slate-200 pt-5 dark:border-slate-800" />

          <div className="flex justify-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#c8102e] transition-colors hover:text-[#a40d26]"
            >
              <ArrowLeft />
              <span>{dictionary.backToSignIn}</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

/* ────────── Icons ────────── */

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.61 19.61 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.78 19.78 0 0 1-3.17 4.19" />
      <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}