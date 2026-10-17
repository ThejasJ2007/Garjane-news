"use client";

import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

let zxcvbn: ZxcvbnFactory | null = null;

function getZxcvbn() {
    if (zxcvbn) return zxcvbn;
    zxcvbn = new ZxcvbnFactory({
        translations: zxcvbnEnPackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
            userInputs: ["garjane", "garjananews", "news"],
        },
    });
    return zxcvbn;
}

export type StrengthLevel =
    | "empty"
    | "veryWeak"
    | "weak"
    | "fair"
    | "good"
    | "strong"
    | "veryStrong";

export const STRENGTH_SEGMENTS = [
    { level: "veryWeak", color: "#dc2626" },
    { level: "weak", color: "#ea580c" },
    { level: "fair", color: "#ca8a04" },
    { level: "good", color: "#2563eb" },
    { level: "strong", color: "#16a34a" },
] as const;

export type StrengthResult = {
    level: StrengthLevel;
    filledSegments: number;
};

const MIN_LENGTH = 8;

export function evaluatePassword(password: string): StrengthResult {
    if (!password) {
        return { level: "empty", filledSegments: 0 };
    }

    const { score } = getZxcvbn().check(password);

    const onlyNumbers = /^\d+$/.test(password);
    const onlyLetters = /^[A-Za-z]+$/.test(password);
    const hasRepeatedRuns = /(.)\1{2,}/.test(password);
    const hasSequence = hasSequentialRun(password);

    let level: StrengthLevel;

    if (password.length < MIN_LENGTH) {
        level = score <= 0 ? "veryWeak" : "weak";
    } else if (onlyNumbers && password.length < 12) {
        level = "weak"; // 123456789 → weak
    } else if (onlyLetters && password.length < 14) {
        level = score >= 3 ? "good" : score >= 2 ? "fair" : "weak";
    } else if (hasRepeatedRuns || hasSequence) {
        level = score <= 1 ? "weak" : "fair";
    } else if (score <= 0) {
        level = "veryWeak";
    } else if (score === 1) {
        level = "weak";
    } else if (score === 2) {
        level = "fair";
    } else if (score === 3) {
        level = password.length >= 12 ? "strong" : "good";
    } else {
        level = "veryStrong";
    }

    const filledSegments = Math.min(
        STRENGTH_SEGMENTS.length,
        level === "empty"
            ? 0
            : level === "veryWeak"
                ? 1
                : level === "weak"
                    ? 2
                    : level === "fair"
                        ? 3
                        : level === "good"
                            ? 4
                            : 5
    );

    return { level, filledSegments };
}

function hasSequentialRun(password: string): boolean {
    const lower = password.toLowerCase();
    let asc = 1;
    let desc = 1;
    for (let i = 1; i < lower.length; i++) {
        const diff = lower.charCodeAt(i) - lower.charCodeAt(i - 1);
        if (diff === 1) {
            asc += 1;
            desc = 1;
        } else if (diff === -1) {
            desc += 1;
            asc = 1;
        } else {
            asc = 1;
            desc = 1;
        }
        if (asc >= 4 || desc >= 4) return true;
    }
    return false;
}