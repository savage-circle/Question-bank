import { CreateQuestionDTO } from "../types/question.ts";

export interface IValidationService {
  isValidWhenProvided(value: number | string | undefined): boolean;
  isNonEmptyString(value: string | null | undefined): boolean;
  isValidPositiveInteger(value: number | string | undefined): boolean;
  isValidEnumValue(value: number | string, enumObj: object): boolean;
  isStringArray(value: string[] | null | undefined): boolean;
  validateQuestionRequest(data: CreateQuestionDTO): { isValid: boolean; error?: string };
}