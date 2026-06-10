import LevelType from "../enums/levelType.ts";
import { QuestionRequest } from "../types/question.ts";

export type ValidationResult = { isValid: boolean; error?: string };

/** Maps a numeric level id to its enum name, falling back to "UNKNOWN". */
export const getLevelName = (levelId: number): string => {
  return LevelType[levelId] ?? "UNKNOWN";
};

/** Parses the stored JSON extensions column into a string array. */
export const parseExtensions = (extensions: string | null): string[] => {
  if (!extensions) {
    return [];
  }

  try {
    const parsed = JSON.parse(extensions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Validates the body of a create/update question request. */
export const validateQuestionRequest = (
  data: QuestionRequest,
): ValidationResult => {
  const { description, topicId, levelId, extensions } = data;

  if (!description || description.trim() === "") {
    return { isValid: false, error: "Question description is required." };
  }

  const topicIdNumber = Number(topicId);

  if (!Number.isInteger(topicIdNumber) || topicIdNumber < 1) {
    return { isValid: false, error: "Invalid topic id." };
  }

  if (!LevelType[Number(levelId)]) {
    return { isValid: false, error: "LevelId should be valid enum value" };
  }

  if (
    extensions &&
    (!Array.isArray(extensions) ||
      extensions.some((ext) => typeof ext !== "string"))
  ) {
    return {
      isValid: false,
      error: "Extensions should be an array of non-empty strings.",
    };
  }

  return { isValid: true };
};
