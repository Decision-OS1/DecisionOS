"use client";

import { useState, useTransition } from "react";
import {
  YesNoToggle,
  OptionList,
  CheckboxList,
  LikertScale,
  TextField,
  TextAreaField,
} from "@/components/form/inputs";
import { AgeBranchStep } from "@/components/onboarding/AgeBranchStep";
import {
  EMPTY_ONBOARDING_DATA,
  PORTFOLIO_OPTIONS,
  TRUST_SOURCES,
  CHALLENGE_OPTIONS,
  type OnboardingData,
} from "@/lib/types/onboarding";
import { submitOnboarding } from "@/app/onboarding/actions";

const STEP_LABELS = ["Demographics", "Portfolio", "Trust", "Challenges", "About You"];
const AGE_GROUPS: OnboardingData["ageGroup"][] = ["<18", "18-30", "31-44", "45-60", "60+"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const SECTORS = ["Public", "Private", "Gig", "N/A"];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING_DATA);
  const [isPending, startTransition] = useTransition();

  function patch(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  const canProceed = (() => {
    switch (step) {
      case 0:
        return data.ageGroup !== "" && data.gender !== "";
      case 1:
        return data.portfolioChoices.length > 0;
      case 2:
        return (
          data.trustGovernment > 0 &&
          data.trustSocialMedia > 0 &&
          data.trustFamily > 0 &&
          data.trustAI > 0
        );
      case 3:
        return data.challengesOpinion.trim().length > 0;
      default:
        return true;
    }
  })();

  function next() {
    if (step < STEP_LABELS.length - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit() {
    startTransition(() => {
      submitOnboarding(data);
    });
  }

  const progressPercent = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        </div>
        <div>
          <p className="text-base font-bold text-text">DecisionOS</p>
          <p className="text-xs text-text-muted">Let&apos;s get to know you</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-text-muted">
          <span>
            Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="card p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-text">Age group</p>
              <OptionList
                options={AGE_GROUPS}
                value={data.ageGroup}
                onChange={(v) => patch({ ageGroup: v as OnboardingData["ageGroup"], ageBranch: {} })}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-text">Gender</p>
              <OptionList options={GENDERS} value={data.gender} onChange={(v) => patch({ gender: v })} />
            </div>
            <TextField
              label="Years making financial decisions"
              type="number"
              value={data.yearsInvesting}
              onChange={(v) => patch({ yearsInvesting: v })}
              placeholder="e.g. 3"
            />
            <YesNoToggle
              label="Currently working"
              value={data.employed}
              onChange={(v) => patch({ employed: v })}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-text">Sector</p>
              <OptionList options={SECTORS} value={data.sector} onChange={(v) => patch({ sector: v })} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-4 text-sm text-text-muted">
              Which of these have you used or invested in? (Select all that apply)
            </p>
            <CheckboxList
              options={PORTFOLIO_OPTIONS}
              value={data.portfolioChoices}
              onChange={(v) => patch({ portfolioChoices: v })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <p className="text-sm text-text-muted">
              How much do you trust each of these sources for financial decisions?
            </p>
            {TRUST_SOURCES.map(({ key, label }) => (
              <LikertScale
                key={key}
                label={label}
                value={data[key]}
                onChange={(v) => patch({ [key]: v } as Partial<OnboardingData>)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-text">
                Which of these affect your financial decisions?
              </p>
              <CheckboxList
                options={CHALLENGE_OPTIONS}
                value={data.challenges}
                onChange={(v) => patch({ challenges: v })}
              />
              <div className="mt-3">
                <TextField
                  label="Other (optional)"
                  value={data.challengesOther}
                  onChange={(v) => patch({ challengesOther: v })}
                  placeholder="Something else that affects your decisions"
                />
              </div>
            </div>
            <TextAreaField
              label="In your own words, what's the biggest challenge you face when making financial decisions?"
              value={data.challengesOpinion}
              onChange={(v) => patch({ challengesOpinion: v })}
              rows={6}
            />
          </div>
        )}

        {step === 4 && (
          <AgeBranchStep
            ageGroup={data.ageGroup}
            answers={data.ageBranch}
            onChange={(ageBranch) => patch({ ageBranch })}
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-text-muted disabled:opacity-0"
        >
          Back
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canProceed}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}
