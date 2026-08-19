import { IValidationService } from "./IValidationService.ts";
import { CreateQuestionDTO } from "../types/question.ts";
import { CreateFollowUpDTO } from "../types/followUp.ts";
import LevelType from "../enums/levelType.ts";

export class ValidationService implements IValidationService{
    isValidWhenProvided(value:number | string | undefined): boolean {
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

    validateCreateCategoryInput(categoryName: string): { isValid: boolean; error?: string } {
        if (!this.isNonEmptyString(categoryName)) {
            return { isValid: false, error: "Category name is required." };
        }

        return { isValid: true };
    }

    validateUpdateCategoryInput(id: string | undefined, categoryName: string): { isValid: boolean; error?: string } {
        if (!this.isValidPositiveInteger(id)) {
            return { isValid: false, error: "Invalid category id." };
        }

        if (!this.isNonEmptyString(categoryName)) {
            return { isValid: false, error: "Category name is required." };
        }

        return { isValid: true };
    }

    validateGetTopicsInput(categoryId: string | undefined): { isValid: boolean; error?: string } {
        if (!this.isValidWhenProvided(categoryId)) {
            return { isValid: false, error: "Invalid categoryId" };
        }
        return { isValid: true };
    }

    validateAddTopicInput(name: string, categoryId: string | undefined): { isValid: boolean; error?: string } {
        if (!this.isValidWhenProvided(categoryId)) {
            return { isValid: false, error: "Invalid categoryId" };
        }
        if (!this.isNonEmptyString(name)) {
            return { isValid: false, error: "Invalid topic name" };
        }
        return { isValid: true };
    }

    validateGetQuestionInput(categoryId: string | undefined, topicId: string | undefined, levelId: string | undefined): { isValid: boolean; error?: string } {
        if (!this.isValidWhenProvided(categoryId)) {
            return { isValid: false, error: "Invalid categoryId" };
        }
        if (!this.isValidWhenProvided(topicId)) {
            return { isValid: false, error: "Invalid topicId" };
        }
        if (!this.isValidWhenProvided(levelId)) {
            return { isValid: false, error: "Invalid levelId" };
        }
        return { isValid: true };
    }

    validateQuestionUpsertInput(data: CreateQuestionDTO): { isValid: boolean; error?: string } {
        const { description, topicId, levelId } = data;

        if (!this.isNonEmptyString(description)) {
            return { isValid: false, error: "Question description is required." };
        }

        if (!this.isValidPositiveInteger(topicId)) {
            return { isValid: false, error: "Invalid topic id." };
        }

        if (!this.isValidEnumValue(levelId, LevelType)) {
            return { isValid: false, error: "LevelId should be valid enum value" };
        }

        return { isValid: true };
    }

    validateFollowUpUpsertInput(data: CreateFollowUpDTO): { isValid: boolean; error?: string } {
        const { description, questionString, levelId } = data;

        if (!this.isNonEmptyString(description)) {
            return { isValid: false, error: "Follow-up description is required." };
        }

        if (!this.isNonEmptyString(questionString)) {
            return { isValid: false, error: "Follow-up question is required." };
        }

        if (!this.isValidEnumValue(levelId, LevelType)) {
            return { isValid: false, error: "LevelId should be valid enum value" };
        }

        return { isValid: true };
    }
}