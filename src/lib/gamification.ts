const POINTS_PER_DECISION = 20;
const POINTS_PER_LEVEL = 300;

const LEVEL_LABELS = ["Newcomer", "Learner", "Explorer", "Strategist", "Sage"];

export function pointsFromDecisions(decisionsMade: number) {
  return decisionsMade * POINTS_PER_DECISION;
}

export function getLevelInfo(points: number) {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsIntoLevel = points % POINTS_PER_LEVEL;
  const progressPercent = Math.round((pointsIntoLevel / POINTS_PER_LEVEL) * 100);
  const label = LEVEL_LABELS[Math.min(level - 1, LEVEL_LABELS.length - 1)];

  return { level, label, progressPercent, pointsIntoLevel, pointsPerLevel: POINTS_PER_LEVEL };
}
