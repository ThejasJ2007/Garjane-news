"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
    STRENGTH_SEGMENTS,
    evaluatePassword,
    type StrengthLevel,
} from "@/lib/passwordStrength";

type PasswordStrengthMeterProps = {
    password: string;
    /** Render the row below an input. We use this to flip to a stacked layout
     * on very small screens so the icon never overlaps the meter. */
    className?: string;
};

const ICON_BG: Record<StrengthLevel, string> = {
    empty: "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
    veryWeak: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
    weak: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300",
    fair: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    good: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    strong: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
    veryStrong: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
};

const TEXT_COLOR: Record<StrengthLevel, string> = {
    empty: "text-slate-500 dark:text-slate-400",
    veryWeak: "text-red-600 dark:text-red-400",
    weak: "text-orange-600 dark:text-orange-400",
    fair: "text-yellow-700 dark:text-yellow-400",
    good: "text-blue-600 dark:text-blue-400",
    strong: "text-green-600 dark:text-green-400",
    veryStrong: "text-green-700 dark:text-green-400",
};

export function PasswordStrengthMeter({
    password,
    className = "",
}: PasswordStrengthMeterProps) {
    const { dictionary } = useLanguage();

    const result = useMemo(() => evaluatePassword(password), [password]);
    const level = result.level;

    // The live region announces its content each time it changes. We render
    // an empty string while the field is empty (no spam on focus) and the
    // latest non-empty label whenever the strength level changes — which is
    // enough to drive `aria-live="polite"` re-announcements.
    const liveMessage =
        level === "empty"
            ? ""
            : `${dictionary.page.strengthAnnouncement}: ${dictionary.strength[level]}`;

    // Respect user's reduced-motion preference.
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => setPrefersReducedMotion(mq.matches);
        handler();
        mq.addEventListener?.("change", handler);
        return () => mq.removeEventListener?.("change", handler);
    }, []);

    const segments = STRENGTH_SEGMENTS;
    const label = dictionary.strength[level];

    const showTooShort = password.length > 0 && password.length < 12;
    const showCommon =
        password.length > 0 &&
        (level === "veryWeak" || level === "weak") &&
        !showTooShort;
    const showTryLonger =
        password.length > 0 &&
        (level === "fair" || level === "good") &&
        !showTooShort;
    const showGreat = level === "strong" || level === "veryStrong";

    const motionClass = prefersReducedMotion
        ? ""
        : "transition-[transform,background-color,box-shadow] duration-300 ease-out";

    return (
        <div className={`w-full ${className}`}>
            <div
                className="flex items-center gap-3"
                role="group"
                aria-label={dictionary.page.strengthMeterLabel}
            >
                <div className="flex flex-1 items-center gap-1.5">
                    {segments.map((segment, idx) => {
                        const isFilled = idx < result.filledSegments;
                        const activeColor = isFilled ? segment.color : undefined;
                        return (
                            <div
                                key={segment.level}
                                className={`relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${motionClass}`}
                                aria-hidden="true"
                            >
                                <div
                                    className={`absolute inset-y-0 left-0 rounded-full ${motionClass}`}
                                    style={{
                                        width: isFilled ? "100%" : "0%",
                                        backgroundColor: activeColor ?? "transparent",
                                        transitionProperty: prefersReducedMotion
                                            ? "none"
                                            : "width, background-color",
                                        transitionDuration: prefersReducedMotion ? "0ms" : "350ms",
                                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <StrengthIcon
                    level={level}
                    prefersReducedMotion={prefersReducedMotion}
                    ariaLabel={dictionary.page.strengthIconLabel}
                />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
                <p
                    className={`text-sm font-medium ${TEXT_COLOR[level]} ${motionClass}`}
                >
                    {label}
                    {(showTooShort || showCommon || showTryLonger || showGreat) && (
                        <>
                            <span
                                className="ml-1 font-normal text-slate-500 dark:text-slate-400"
                                aria-hidden="true"
                            >
                                {" — "}
                            </span>
                            <span
                                className="font-normal text-slate-600 dark:text-slate-300"
                                aria-hidden="true"
                            >
                                {showTooShort
                                    ? dictionary.guidance.tooShort
                                    : showCommon
                                        ? dictionary.guidance.common
                                        : showTryLonger
                                            ? dictionary.guidance.longCombination
                                            : dictionary.guidance.great}
                            </span>
                        </>
                    )}
                </p>
            </div>

            {/* Live region for screen-reader announcements of strength changes. */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {liveMessage}
            </div>
        </div>
    );
}

function StrengthIcon({
    level,
    prefersReducedMotion,
    ariaLabel,
}: {
    level: StrengthLevel;
    prefersReducedMotion: boolean;
    ariaLabel: string;
}) {
    const motionClass = prefersReducedMotion
        ? ""
        : "transition-all duration-300 ease-out";

    return (
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_BG[level]} ${motionClass}`}
            role="img"
            aria-label={`${ariaLabel}: ${level}`}
        >
            <IconByLevel level={level} />
        </div>
    );
}

function IconByLevel({ level }: { level: StrengthLevel }): ReactNode {
    switch (level) {
        case "empty":
            return <LockIcon />;
        case "veryWeak":
            return <AlertIcon />;
        case "weak":
            return <LockIcon />;
        case "fair":
            return <LockIcon />;
        case "good":
            return <ShieldIcon />;
        case "strong":
            return <ShieldIcon />;
        case "veryStrong":
            return <ShieldCheckIcon />;
    }
}

function LockIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
    );
}

function ShieldCheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}