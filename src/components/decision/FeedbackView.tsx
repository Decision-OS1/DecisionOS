"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { RobotMascot } from "@/components/RobotMascot";

interface FeedbackViewProps {
  dayNumber: number;
  maxCompletedDay: number;
  isProgramComplete: boolean;
  selectedResponse: string;
  aiFeedback: string;
  inferredBias: string | null;
}

export function FeedbackView({
  dayNumber,
  maxCompletedDay,
  isProgramComplete,
  selectedResponse,
  aiFeedback,
  inferredBias,
}: FeedbackViewProps) {
  const [helpful, setHelpful] = useState<"up" | "down" | null>(null);
  const isLatest = dayNumber >= maxCompletedDay;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        {dayNumber > 1 ? (
          <Link
            href={`/decision/feedback?day=${dayNumber - 1}`}
            className="text-sm font-medium text-text-muted hover:text-text"
          >
            ← Back
          </Link>
        ) : (
          <span />
        )}
        <h1 className="text-base font-bold text-text">Scenario {dayNumber} Feedback</h1>
        {dayNumber < maxCompletedDay ? (
          <Link
            href={`/decision/feedback?day=${dayNumber + 1}`}
            className="text-sm font-medium text-text-muted hover:text-text"
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="card mt-6 p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text">
              Here&apos;s your AI feedback ✨
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-1.5 text-sm font-medium text-success">
              ✓ You chose: {selectedResponse}
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-text">AI Coach</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {aiFeedback}
              </p>
            </div>
          </div>
          <RobotMascot size={80} className="flex-shrink-0" />
        </div>

        {inferredBias && (
          <div className="mt-6 rounded-2xl bg-danger-soft p-5">
            <p className="text-xs font-semibold text-text-muted">
              Possible Bias Detected
            </p>
            <p className="mt-1 text-base font-bold text-text">{inferredBias}</p>
            <p className="mt-1 text-sm text-text-muted">
              This pattern shows up often in financial decision-making research.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <p className="text-sm text-text-muted">Was this feedback helpful?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHelpful("up")}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                helpful === "up"
                  ? "border-success bg-success-soft text-success"
                  : "border-border text-text-muted hover:border-primary"
              }`}
            >
              <ThumbsUp size={16} />
            </button>
            <button
              type="button"
              onClick={() => setHelpful("down")}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                helpful === "down"
                  ? "border-danger bg-danger-soft text-danger"
                  : "border-border text-text-muted hover:border-primary"
              }`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>

        {isLatest && (
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            {isProgramComplete ? (
              <Link
                href="/progress"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                View My Progress
              </Link>
            ) : (
              <Link
                href="/decision"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Next Scenario
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
