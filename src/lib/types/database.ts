export type AgeGroup = "<18" | "18-30" | "31-44" | "45-60" | "60+";
export type Sector = "Public" | "Private" | "Gig" | "N/A";
export type ConfidenceLevel =
  | "Very confident"
  | "Somewhat confident"
  | "Not very confident"
  | "Not confident at all";

export type UserProfileRow = {
  id: string;
  email: string;
  name: string | null;
  gender: string | null;
  age_group: AgeGroup | null;
  years_investing: number | null;
  employed: boolean | null;
  sector: Sector | null;
  created_at: string;
};

export type ProfileSurveyRow = {
  id: string;
  user_id: string;
  portfolio_choices: string[] | null;
  trust_sources: Record<string, number> | null;
  challenges: string[] | null;
  challenges_opinion: string | null;
  age_branch_answers: Record<string, unknown> | null;
  submitted_at: string;
};

export type SurveyResponseRow = {
  id: string;
  user_id: string;
  day_number: number;
  scenario_id: string;
  scenario_prompt: string | null;
  scenario_question: string | null;
  intervention_type: string | null;
  selected_response: string;
  confidence_level: ConfidenceLevel;
  response_latency_ms: number | null;
  inferred_bias: string | null;
  ai_feedback: string | null;
  created_at: string;
};

export type LeaderboardRow = {
  user_id: string;
  name: string | null;
  decisions_made: number;
  points: number;
};

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: Partial<UserProfileRow> & { id: string; email: string };
        Update: Partial<UserProfileRow>;
        Relationships: [];
      };
      profile_survey: {
        Row: ProfileSurveyRow;
        Insert: Partial<ProfileSurveyRow> & { user_id: string };
        Update: Partial<ProfileSurveyRow>;
        Relationships: [];
      };
      survey_responses: {
        Row: SurveyResponseRow;
        Insert: Partial<SurveyResponseRow> & {
          user_id: string;
          day_number: number;
          scenario_id: string;
          selected_response: string;
          confidence_level: ConfidenceLevel;
        };
        Update: Partial<SurveyResponseRow>;
        Relationships: [];
      };
    };
    Views: {
      leaderboard: {
        Row: LeaderboardRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};
