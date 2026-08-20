import { IValidationService } from "./IValidationService.ts";
import { CreateQuestionDTO } from "../types/question.ts";
import { CreateFollowUpDTO } from "../types/followUp.ts";
import LevelType from "../enums/levelType.ts";
import { Messages } from "../constants.ts";

export class ValidationService implements IValidationService {
  isValidWhenProvided(value: number | string | undefined): boolean {
    return value === undefined || Number(value) > 0;
  }

  isNonEmptyString(value: string | null | undefined): boolean {
    return typeof value === "string" && value.trim() !== "";
  }

  isValidPositiveInteger(value: number | string | undefined): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num >= 1;
  }

  isValidEnumValue(value: number | string, enumObj: object): boolean {
    return Object.values(enumObj).includes(Number(value));
  }

  validateCreateCategoryInput(categoryName: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!this.isNonEmptyString(categoryName)) {
      return { isValid: false, error: Messages.CategoryNameRequired };
    }

    return { isValid: true };
  }

  validateUpdateCategoryInput(
    id: string | undefined,
    categoryName: string,
  ): { isValid: boolean; error?: string } {
    if (!this.isValidPositiveInteger(id)) {
      return { isValid: false, error: Messages.InvalidCategoryId };
    }

    if (!this.isNonEmptyString(categoryName)) {
      return { isValid: false, error: Messages.CategoryNameRequired };
    }

    return { isValid: true };
  }

  validateGetTopicsInput(categoryId: string | undefined): {
    isValid: boolean;
    error?: string;
  } {
    if (!this.isValidWhenProvided(categoryId)) {
      return { isValid: false, error: Messages.InvalidCategoryIdParam };
    }
    return { isValid: true };
  }

  validateAddTopicInput(
    name: string,
    categoryId: string | undefined,
  ): { isValid: boolean; error?: string } {
    if (!this.isValidWhenProvided(categoryId)) {
      return { isValid: false, error: Messages.InvalidCategoryIdParam };
    }
    if (!this.isNonEmptyString(name)) {
      return { isValid: false, error: Messages.InvalidTopicName };
    }
    return { isValid: true };
  }

  validateGetQuestionInput(
    categoryId: string | undefined,
    topicId: string | undefined,
    levelId: string | undefined,
  ): { isValid: boolean; error?: string } {
    if (!this.isValidWhenProvided(categoryId)) {
      return { isValid: false, error: Messages.InvalidCategoryIdParam };
    }
    if (!this.isValidWhenProvided(topicId)) {
      return { isValid: false, error: Messages.InvalidTopicIdParam };
    }
    if (!this.isValidWhenProvided(levelId)) {
      return { isValid: false, error: Messages.InvalidLevelIdParam };
    }
    return { isValid: true };
  }

  validateQuestionUpsertInput(data: CreateQuestionDTO): {
    isValid: boolean;
    error?: string;
  } {
    const { description, topicId, levelId } = data;

    if (!this.isNonEmptyString(description)) {
      return { isValid: false, error: Messages.QuestionDescriptionRequired };
    }

    if (!this.isValidPositiveInteger(topicId)) {
      return { isValid: false, error: Messages.InvalidTopicId };
    }

    if (!this.isValidEnumValue(levelId, LevelType)) {
      return { isValid: false, error: Messages.InvalidLevelId };
    }

    return { isValid: true };
  }

  validateFollowUpUpsertInput(data: CreateFollowUpDTO): {
    isValid: boolean;
    error?: string;
  } {
    const { description, question, levelId } = data;

    if (!this.isNonEmptyString(description)) {
      return { isValid: false, error: Messages.FollowUpDescriptionRequired };
    }

    if (!this.isNonEmptyString(question)) {
      return { isValid: false, error: Messages.FollowUpQuestionRequired };
    }

    if (!this.isValidEnumValue(levelId, LevelType)) {
      return { isValid: false, error: Messages.InvalidLevelId };
    }

    return { isValid: true };
  }
}
