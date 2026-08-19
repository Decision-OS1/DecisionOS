"use client";

import { YesNoToggle, OptionList, TextField, TextAreaField } from "@/components/form/inputs";
import type { OnboardingData } from "@/lib/types/onboarding";

interface AgeBranchStepProps {
  ageGroup: OnboardingData["ageGroup"];
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
}

function set(answers: Record<string, string>, key: string, value: string) {
  return { ...answers, [key]: value };
}

export function AgeBranchStep({ ageGroup, answers, onChange }: AgeBranchStepProps) {
  const update = (key: string, value: string) => onChange(set(answers, key, value));

  if (ageGroup === "<18") {
    return (
      <div className="space-y-6">
        <YesNoToggle
          label="Are you allowed to make financial decisions independently?"
          value={answers.allowedIndependent ?? ""}
          onChange={(v) => update("allowedIndependent", v)}
        />
        <YesNoToggle
          label="Do you invest under your parents' account?"
          value={answers.investsUnderParents ?? ""}
          onChange={(v) => update("investsUnderParents", v)}
        />
        {answers.investsUnderParents === "yes" && (
          <TextAreaField
            label="Anything you'd like to share about that? (optional)"
            value={answers.investsUnderParentsInsight ?? ""}
            onChange={(v) => update("investsUnderParentsInsight", v)}
            rows={3}
          />
        )}
        <YesNoToggle
          label="Are you employed?"
          value={answers.employed ?? ""}
          onChange={(v) => update("employed", v)}
        />
      </div>
    );
  }

  if (ageGroup === "18-30") {
    return (
      <div className="space-y-6">
        <YesNoToggle
          label="Are you currently studying?"
          value={answers.studying ?? ""}
          onChange={(v) => update("studying", v)}
        />
        <div>
          <p className="mb-2 text-sm font-medium text-text">
            Do you earn and invest independently, or use money someone else gives you?
          </p>
          <OptionList
            options={[
              "I earn and invest independently",
              "I use money someone else gives me",
            ]}
            value={answers.incomeSource ?? ""}
            onChange={(v) => update("incomeSource", v)}
          />
        </div>
        <YesNoToggle
          label="Do you feel your income is stable enough to invest?"
          value={answers.incomeStable ?? ""}
          onChange={(v) => update("incomeStable", v)}
        />
        <YesNoToggle
          label="Do you have kids?"
          value={answers.haveKids ?? ""}
          onChange={(v) => update("haveKids", v)}
        />
        {answers.haveKids === "yes" && (
          <>
            <YesNoToggle
              label="Does having kids influence your investment decisions?"
              value={answers.kidsInfluence ?? ""}
              onChange={(v) => update("kidsInfluence", v)}
            />
            {answers.kidsInfluence === "yes" && (
              <TextAreaField
                label="Tell us how (optional)"
                value={answers.kidsInfluenceText ?? ""}
                onChange={(v) => update("kidsInfluenceText", v)}
                rows={3}
              />
            )}
          </>
        )}
        <YesNoToggle
          label="Are you employed?"
          value={answers.employed ?? ""}
          onChange={(v) => update("employed", v)}
        />
      </div>
    );
  }

  if (ageGroup === "31-44") {
    return (
      <div className="space-y-6">
        <YesNoToggle
          label="Do you have kids?"
          value={answers.haveKids ?? ""}
          onChange={(v) => update("haveKids", v)}
        />
        {answers.haveKids === "yes" && (
          <>
            <YesNoToggle
              label="Does having kids influence your portfolio decisions?"
              value={answers.kidsInfluence ?? ""}
              onChange={(v) => update("kidsInfluence", v)}
            />
            {answers.kidsInfluence === "yes" && (
              <TextAreaField
                label="Tell us how (optional)"
                value={answers.kidsInfluenceText ?? ""}
                onChange={(v) => update("kidsInfluenceText", v)}
                rows={3}
              />
            )}
          </>
        )}
        <YesNoToggle
          label="Are you employed?"
          value={answers.employed ?? ""}
          onChange={(v) => update("employed", v)}
        />
      </div>
    );
  }

  if (ageGroup === "45-60") {
    return (
      <div className="space-y-6">
        <YesNoToggle
          label="Are you employed?"
          value={answers.employed ?? ""}
          onChange={(v) => update("employed", v)}
        />
        <YesNoToggle
          label="Do you consult anyone before making financial decisions?"
          value={answers.consultsAnyone ?? ""}
          onChange={(v) => update("consultsAnyone", v)}
        />
        {answers.consultsAnyone === "yes" && (
          <TextField
            label="Who do you consult?"
            value={answers.consultsWho ?? ""}
            onChange={(v) => update("consultsWho", v)}
            placeholder="e.g. spouse, financial advisor, children"
          />
        )}
        <YesNoToggle
          label="Are you reliant on external sources for financial decisions?"
          value={answers.reliantOnExternal ?? ""}
          onChange={(v) => update("reliantOnExternal", v)}
        />
        {answers.reliantOnExternal === "yes" && (
          <TextField
            label="Which sources?"
            value={answers.reliantOnExternalWhich ?? ""}
            onChange={(v) => update("reliantOnExternalWhich", v)}
            placeholder="e.g. news, bank advisor, YouTube"
          />
        )}
      </div>
    );
  }

  if (ageGroup === "60+") {
    const showSurplusQuestion =
      answers.expenditureChange === "Decreased" || answers.expenditureChange === "Same";

    return (
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-text">
            Are you working or retired?
          </p>
          <OptionList
            options={["Working", "Retired"]}
            value={answers.workStatus ?? ""}
            onChange={(v) => update("workStatus", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-text">
            Has your expenditure changed since retirement, excluding health costs?
          </p>
          <OptionList
            options={["Increased", "Decreased", "Same"]}
            value={answers.expenditureChange ?? ""}
            onChange={(v) => update("expenditureChange", v)}
          />
        </div>
        <TextAreaField
          label="Describe (optional)"
          value={answers.expenditureChangeDescribe ?? ""}
          onChange={(v) => update("expenditureChangeDescribe", v)}
          rows={3}
        />
        {showSurplusQuestion && (
          <TextAreaField
            label="What do you currently do with the surplus money?"
            value={answers.surplusUse ?? ""}
            onChange={(v) => update("surplusUse", v)}
            rows={3}
          />
        )}
      </div>
    );
  }

  return (
    <p className="text-sm text-text-muted">
      Select your age group in Step 1 to continue.
    </p>
  );
}
