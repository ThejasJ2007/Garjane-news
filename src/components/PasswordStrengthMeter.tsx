"use client";

import { useEffect, useMemo, useState } from "react";
import {
    STRENGTH_SEGMENTS,
    evaluatePassword,
    type StrengthLevel,
} from "@/lib/passwordStrength";
import { useLanguage } from "@/contexts/LanguageContext";

type PasswordStrengthMeterProps = {
    password: string;
    labels?: Record<StrengthLevel, string>;
    goodJobLabel?: string;
    meterLabel?: string;
    iconLabel?: string;
    announcement?: string;
};

const ICON_BG: Record<StrengthLevel, string> = {
    empty: "bg-slate-200 text-slate-500",
    veryWeak: "bg-red-100 text-red-600",
    weak: "bg-orange-100 text-orange-600",
    fair: "bg-yellow-100 text-yellow-700",
    good: "bg-blue-100 text-blue-600",
    strong: "bg-green-100 text-green-600",
    veryStrong: "bg-green-100 text-green-600",
};

const TEXT_COLOR: Record<StrengthLevel, string> = {
    empty: "text-slate-500",
    veryWeak: "text-red-600",
    weak: "text-orange-600",
    fair: "text-yellow-700",
    good: "text-blue-600",
    strong: "text-green-600",
    veryStrong: "text-green-700",
};

export function PasswordStrengthMeter({
    password,
    labels,
    goodJobLabel,
    meterLabel,
    iconLabel,
    announcement,
}: PasswordStrengthMeterProps) {
    const { language } = useLanguage();

    const defaultLabels: Record<StrengthLevel, string> = useMemo(() => {
        return language === "kn"
            ? {
                  empty: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
                  veryWeak: "ಬಹಳ ದುರ್ಬಲ",
                  weak: "ದುರ್ಬಲ",
                  fair: "ಸಾಧಾರಣ",
                  good: "ಉತ್ತಮ",
                  strong: "ಬಲವಾದ",
                  veryStrong: "ಅತ್ಯಂತ ಬಲವಾದ",
              }
            : {
                  empty: "Enter a password",
                  veryWeak: "Very Weak",
                  weak: "Weak",
                  fair: "Fair",
                  good: "Good",
                  strong: "Strong",
                  veryStrong: "Very Strong",
              };
    }, [language]);

    const activeLabels = labels ?? defaultLabels;
    const activeGoodJobLabel =
        goodJobLabel ?? (language === "kn" ? "ಉತ್ತಮ ಕೆಲಸ! 👍" : "Good Job !👍");
    const activeMeterLabel =
        meterLabel ?? (language === "kn" ? "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ" : "Password strength");
    const activeIconLabel =
        iconLabel ??
        (language === "kn"
            ? "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಸೂಚಕ"
            : "Password strength indicator");
    const activeAnnouncement =
        announcement ??
        (language === "kn"
            ? "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಬದಲಾಗಿದೆ"
            : "Password strength changed to");

    const { level, filledSegments } = useMemo(
        () => evaluatePassword(password),
        [password]
    );

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => setPrefersReducedMotion(mq.matches);
        handler();
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const showGoodJob = level === "strong" || level === "veryStrong";

    const liveMessage =
        level === "empty" ? "" : `${activeAnnouncement}: ${activeLabels[level]}`;

    return (
        <div className="mt-2 w-full">
            <div
                className="flex items-center gap-3"
                role="group"
                aria-label={activeMeterLabel}
            >
                <div className="flex flex-1 items-center gap-1.5">
                    {STRENGTH_SEGMENTS.map((segment, idx) => {
                        const filled = idx < filledSegments;
                        return (
                            <div
                                key={segment.level}
                                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
                                aria-hidden="true"
                            >
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    style={{
                                        width: filled ? "100%" : "0%",
                                        backgroundColor: filled ? segment.color : "transparent",
                                        transitionProperty: prefersReducedMotion
                                            ? "none"
                                            : "width, background-color",
                                        transitionDuration: prefersReducedMotion ? "0ms" : "300ms",
                                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_BG[level]}`}
                    role="img"
                    aria-label={`${activeIconLabel}: ${activeLabels[level]}`}
                    style={{
                        transitionProperty: prefersReducedMotion
                            ? "none"
                            : "background-color, color",
                        transitionDuration: prefersReducedMotion ? "0ms" : "300ms",
                    }}
                >
                    <Icon level={level} />
                </div>
            </div>

            <p
                className={`mt-2 text-sm font-medium ${TEXT_COLOR[level]}`}
                style={{
                    transitionProperty: prefersReducedMotion ? "none" : "color",
                    transitionDuration: prefersReducedMotion ? "0ms" : "300ms",
                }}
            >
                {activeLabels[level]}
                {showGoodJob && (
                    <>
                        <span className="ml-1 font-normal text-slate-500">{" — "}</span>
                        <span className="font-normal text-slate-600">{activeGoodJobLabel}</span>
                    </>
                )}
            </p>

            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {liveMessage}
            </div>
        </div>
    );
}

function Icon({ level }: { level: StrengthLevel }) {
    const common = {
        width: 18,
        height: 18,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    if (level === "veryStrong") {
        return (
            <svg {...common}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }

    if (level === "veryWeak") {
        return (
            <svg {...common}>
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
    );
}