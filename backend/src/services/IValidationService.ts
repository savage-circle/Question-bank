import { CreateQuestionDTO } from "../types/question.ts";

export interface IValidationService {
  isValidWhenProvided(value: number | string | undefined): boolean;
  isNonEmptyString(value: string | null | undefined): boolean;
  isValidPositiveInteger(value: number | string | undefined): boolean;
  isValidEnumValue(value: number | string, enumObj: object): boolean;
  isStringArray(value: string[] | null | undefined): boolean;
  validateQuestionUpsertInput(data: CreateQuestionDTO): { isValid: boolean; error?: string };
  validateGetQuestionInput(categoryId: string | undefined, topicId: string | undefined, levelId: string | undefined): { isValid: boolean; error?: string };
}