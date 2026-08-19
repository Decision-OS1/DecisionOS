export type YesNo = "yes" | "no" | "";

export interface OnboardingData {
  // Section A — Demographics
  ageGroup: "" | "<18" | "18-30" | "31-44" | "45-60" | "60+";
  gender: string;
  yearsInvesting: string;
  employed: YesNo;
  sector: string;

  // Section B — Portfolio
  portfolioChoices: string[];

  // Section C — Trust (1-5 per source)
  trustGovernment: number;
  trustSocialMedia: number;
  trustFamily: number;
  trustAI: number;

  // Section D — Challenges
  challenges: string[];
  challengesOther: string;
  challengesOpinion: string;

  // Section E — Age branching (shape depends on ageGroup)
  ageBranch: Record<string, string>;
}

export const EMPTY_ONBOARDING_DATA: OnboardingData = {
  ageGroup: "",
  gender: "",
  yearsInvesting: "",
  employed: "",
  sector: "",
  portfolioChoices: [],
  trustGovernment: 0,
  trustSocialMedia: 0,
  trustFamily: 0,
  trustAI: 0,
  challenges: [],
  challengesOther: "",
  challengesOpinion: "",
  ageBranch: {},
};

export const PORTFOLIO_OPTIONS = [
  "Fixed Deposit / CD / RD",
  "Stocks",
  "Bonds",
  "Mutual Funds",
  "Futures & Options",
  "Dividends",
  "IPO",
  "SIP — Small Cap",
  "Mid Cap",
  "Large Cap",
  "Real Estate",
  "Savings Account Interest",
  "None of the above / I don't invest",
];

export const TRUST_SOURCES = [
  { key: "trustGovernment", label: "Government / Newspapers / Reports" },
  {
    key: "trustSocialMedia",
    label: "Social Media / Influencers (Instagram, YouTube, Facebook)",
  },
  { key: "trustFamily", label: "Family / Friends" },
  { key: "trustAI", label: "AI (ChatGPT, Claude, Gemini)" },
] as const;

export const CHALLENGE_OPTIONS = [
  "Gender",
  "Job security",
  "Disagreement among family",
  "Income level",
  "Poverty",
];
