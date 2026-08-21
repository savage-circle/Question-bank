import { IValidationService } from "../../src/services/IValidationService.ts";

export const createMockValidationService = (
  overrides: Partial<IValidationService> = {},
): IValidationService => ({
  isValidWhenProvided: () => true,
  isNonEmptyString: () => true,
  isValidPositiveInteger: () => true,
  isValidEnumValue: () => true,
  validateCreateCategoryInput: () => ({ isValid: true }),
  validateUpdateCategoryInput: () => ({ isValid: true }),
  validateQuestionUpsertInput: () => ({ isValid: true }),
  validateFollowUpUpsertInput: () => ({ isValid: true }),
  validateGetQuestionInput: () => ({ isValid: true }),
  validateGetTopicsInput: () => ({ isValid: true }),
  validateAddTopicInput: () => ({ isValid: true }),
  ...overrides,
});
