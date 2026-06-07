export enum DifficultyLevel {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export const LEVEL_DEFINITIONS = [
  { id: 1, name: DifficultyLevel.Easy },
  { id: 2, name: DifficultyLevel.Medium },
  { id: 3, name: DifficultyLevel.Hard },
] as const;
