"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CreditCard, TrendingUp, ShieldCheck, ShoppingBag, MoreHorizontal } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";
import type { ConfidenceLevel } from "@/lib/types/database";
import { submitDecision } from "@/app/(app)/decision/actions";

const OPTION_ICONS = [CreditCard, TrendingUp, ShieldCheck, ShoppingBag, MoreHorizontal];

const CONFIDENCE_LEVELS: { level: ConfidenceLevel; emoji: string }[] = [
  { level: "Very confident", emoji: "😄" },
  { level: "Somewhat confident", emoji: "🙂" },
  { level: "Not very confident", emoji: "😕" },
  { level: "Not confident at all", emoji: "😟" },
];

interface DecisionFormProps {
  scenario: Scenario;
  dayNumber: number;
  totalDays: number;
  userName: string;
}

export function DecisionForm({ scenario, dayNumber, totalDays, userName }: DecisionFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [isPending, startTransition] = useTransition();
  const startTime = useRef<number>(0);
  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const canSubmit = selectedOption !== null && confidence !== null;

  function handleSubmit() {
    if (!selectedOption || !confidence) return;
    const latencyMs = Date.now() - startTime.current;
    startTransition(() => {
      submitDecision({
        dayNumber,
        scenarioId: scenario.id,
        interventionType: scenario.interventionType,
        selectedOptionId: selectedOption,
        confidenceLevel: confidence,
        latencyMs,
      });
    });
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{userName}</p>
            <p className="text-xs text-text-muted">Participant</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs font-medium text-text-muted">
          <span>Scenario {dayNumber} of {totalDays}</span>
          <Link href="/home" className="hover:text-text">
            Exit
          </Link>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${(dayNumber / totalDays) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-bg p-4">
          <p className="text-xs font-semibold text-text">Scenario</p>
          <p className="mt-2 text-sm leading-relaxed text-text">{scenario.prompt}</p>
          <p className="mt-4 text-sm font-semibold text-text">{scenario.question}</p>
          <p className="mt-2 text-xs text-text-muted">
            There is no right or wrong answer. We&apos;re interested in your decision.
          </p>
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-text-muted">
          🔒 Your responses are anonymous and secure.
        </p>
      </div>

      <div className="card p-8">
        <p className="text-sm font-medium text-text">
          Choose the option that best represents what you would actually do.
        </p>
        <div className="mt-4 space-y-2">
          {scenario.options.map((option, i) => {
            const Icon = OPTION_ICONS[i % OPTION_ICONS.length];
            const selected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOption(option.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                    selected ? "bg-primary text-white" : "bg-bg text-text-muted"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-text"}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-text-muted">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm font-medium text-text">
          How confident are you in your choice?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONFIDENCE_LEVELS.map(({ level, emoji }) => {
            const selected = confidence === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setConfidence(level)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-xs font-medium transition ${
                  selected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-text-muted hover:border-primary/50"
                }`}
              >
                <span className="text-xl">{emoji}</span>
                {level}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Submitting..." : "Submit Decision"}
          </button>
        </div>
      </div>
    </div>
  );
}
