import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { ValidationService } from "../../src/services/ValidationService.ts";
import LevelType from "../../src/enums/levelType.ts";
import { Messages } from "../../src/constants.ts";

describe("ValidationService", () => {
  const validationService = new ValidationService();

  describe("isValidWhenProvided", () => {
    it("should return true for undefined value", () => {
      const result = validationService.isValidWhenProvided(undefined);
      assertEquals(result, true);
    });
    it("should return true for positive number", () => {
      const result = validationService.isValidWhenProvided(5);
      assertEquals(result, true);
    });

    it("should return false for zero", () => {
      const result = validationService.isValidWhenProvided(0);
      assertEquals(result, false);
    });

    it("should return false for negative number", () => {
      const result = validationService.isValidWhenProvided(-3);
      assertEquals(result, false);
    });

    it("should return true for positive string number", () => {
      const result = validationService.isValidWhenProvided("10");
      assertEquals(result, true);
    });

    it("should return false for zero string number", () => {
      const result = validationService.isValidWhenProvided("0");
      assertEquals(result, false);
    });

    it("should return false for negative string number", () => {
      const result = validationService.isValidWhenProvided("-2");
      assertEquals(result, false);
    });

    it("should return false for non-numeric string", () => {
      const result = validationService.isValidWhenProvided("abc");
      assertEquals(result, false);
    });
  });

  describe("isNonEmptyString", () => {
    it("should return true for a non-empty string", () => {
      assertEquals(validationService.isNonEmptyString("hello"), true);
    });

    it("should return false for an empty string", () => {
      assertEquals(validationService.isNonEmptyString(""), false);
    });

    it("should return false for a whitespace-only string", () => {
      assertEquals(validationService.isNonEmptyString("   "), false);
    });

    it("should return false for null", () => {
      assertEquals(validationService.isNonEmptyString(null), false);
    });

    it("should return false for undefined", () => {
      assertEquals(validationService.isNonEmptyString(undefined), false);
    });
  });

  describe("isValidPositiveInteger", () => {
    it("should return true for a positive integer", () => {
      assertEquals(validationService.isValidPositiveInteger(1), true);
    });

    it("should return true for a positive integer string", () => {
      assertEquals(validationService.isValidPositiveInteger("5"), true);
    });

    it("should return false for zero", () => {
      assertEquals(validationService.isValidPositiveInteger(0), false);
    });

    it("should return false for a negative integer", () => {
      assertEquals(validationService.isValidPositiveInteger(-1), false);
    });

    it("should return false for a float", () => {
      assertEquals(validationService.isValidPositiveInteger(1.5), false);
    });

    it("should return false for a non-numeric string", () => {
      assertEquals(validationService.isValidPositiveInteger("abc"), false);
    });
  });

  describe("isValidEnumValue", () => {
    it("should return true for a valid enum value", () => {
      assertEquals(validationService.isValidEnumValue(1, LevelType), true);
    });

    it("should return true for a valid enum value as string", () => {
      assertEquals(validationService.isValidEnumValue("2", LevelType), true);
    });

    it("should return false for a value not in the enum", () => {
      assertEquals(validationService.isValidEnumValue(99, LevelType), false);
    });

    it("should return false for zero", () => {
      assertEquals(validationService.isValidEnumValue(0, LevelType), false);
    });

    it("should return false for a non-numeric string", () => {
      assertEquals(validationService.isValidEnumValue("abc", LevelType), false);
    });
  });

  describe("validateQuestionUpsertInput", () => {
    it("should return valid for a valid request", () => {
      const result = validationService.validateQuestionUpsertInput({
        description: "Q1",
        topicId: 1,
        levelId: 1,
      });
      assertEquals(result, { isValid: true });
    });

    it("should return invalid if description is empty", () => {
      const result = validationService.validateQuestionUpsertInput({
        description: "",
        topicId: 1,
        levelId: 1,
      });
      assertEquals(result, { isValid: false, error: Messages.QuestionDescriptionRequired });
    });

    it("should return invalid if topicId is not a positive integer", () => {
      const result = validationService.validateQuestionUpsertInput({
        description: "Q1",
        topicId: 0,
        levelId: 1,
      });
      assertEquals(result, { isValid: false, error: Messages.InvalidTopicId });
    });

    it("should return invalid if levelId is not a valid enum value", () => {
      const result = validationService.validateQuestionUpsertInput({
        description: "Q1",
        topicId: 1,
        levelId: 99,
      });
      assertEquals(result, { isValid: false, error: Messages.InvalidLevelId });
    });
  });

  describe("validateFollowUpUpsertInput", () => {
    it("should return valid for a valid request", () => {
      const result = validationService.validateFollowUpUpsertInput({
        levelId: 1,
        description: "Follow up",
        question: "Next?",
      });
      assertEquals(result, { isValid: true });
    });

    it("should return invalid if description is empty", () => {
      const result = validationService.validateFollowUpUpsertInput({
        levelId: 1,
        description: "",
        question: "Next?",
      });
      assertEquals(result, { isValid: false, error: Messages.FollowUpDescriptionRequired });
    });

    it("should return invalid if question is empty", () => {
      const result = validationService.validateFollowUpUpsertInput({
        levelId: 1,
        description: "Follow up",
        question: "",
      });
      assertEquals(result, { isValid: false, error: Messages.FollowUpQuestionRequired });
    });

    it("should return invalid if levelId is not a valid enum value", () => {
      const result = validationService.validateFollowUpUpsertInput({
        levelId: 99,
        description: "Follow up",
        question: "Next?",
      });
      assertEquals(result, { isValid: false, error: Messages.InvalidLevelId });
    });
  });

  describe("validateGetQuestionInput", () => {
    it("should return valid when all params are undefined", () => {
      assertEquals(
        validationService.validateGetQuestionInput(
          undefined,
          undefined,
          undefined,
        ),
        { isValid: true },
      );
    });

    it("should return valid when all params are valid", () => {
      assertEquals(validationService.validateGetQuestionInput("1", "2", "1"), {
        isValid: true,
      });
    });

    it("should return valid when only categoryId is provided and valid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", undefined, undefined),
        { isValid: true },
      );
    });

    it("should return invalid if categoryId is zero", () => {
      assertEquals(
        validationService.validateGetQuestionInput("0", undefined, undefined),
        { isValid: false, error: Messages.InvalidCategoryIdParam },
      );
    });

    it("should return invalid if categoryId is negative", () => {
      assertEquals(
        validationService.validateGetQuestionInput("-1", undefined, undefined),
        { isValid: false, error: Messages.InvalidCategoryIdParam },
      );
    });

    it("should return invalid if categoryId is non-numeric", () => {
      assertEquals(
        validationService.validateGetQuestionInput("abc", undefined, undefined),
        { isValid: false, error: Messages.InvalidCategoryIdParam },
      );
    });

    it("should return invalid if topicId is zero when categoryId is valid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", "0", undefined),
        { isValid: false, error: Messages.InvalidTopicIdParam },
      );
    });

    it("should return invalid if topicId is negative when categoryId is valid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", "-1", undefined),
        { isValid: false, error: Messages.InvalidTopicIdParam },
      );
    });

    it("should return invalid if topicId is non-numeric when categoryId is valid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", "abc", undefined),
        { isValid: false, error: Messages.InvalidTopicIdParam },
      );
    });

    it("should return invalid if levelId is zero when categoryId and topicId are valid", () => {
      assertEquals(validationService.validateGetQuestionInput("1", "2", "0"), {
        isValid: false,
        error: Messages.InvalidLevelIdParam,
      });
    });

    it("should return invalid if levelId is negative when categoryId and topicId are valid", () => {
      assertEquals(validationService.validateGetQuestionInput("1", "2", "-1"), {
        isValid: false,
        error: Messages.InvalidLevelIdParam,
      });
    });

    it("should return invalid if levelId is non-numeric when categoryId and topicId are valid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", "2", "abc"),
        { isValid: false, error: Messages.InvalidLevelIdParam },
      );
    });

    it("should return categoryId error first when both categoryId and topicId are invalid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("abc", "abc", undefined),
        { isValid: false, error: Messages.InvalidCategoryIdParam },
      );
    });

    it("should return categoryId error first when all params are invalid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("abc", "abc", "abc"),
        { isValid: false, error: Messages.InvalidCategoryIdParam },
      );
    });

    it("should return topicId error first when categoryId is valid but topicId and levelId are invalid", () => {
      assertEquals(
        validationService.validateGetQuestionInput("1", "abc", "abc"),
        { isValid: false, error: Messages.InvalidTopicIdParam },
      );
    });
  });

  describe("validateGetTopicsInput", () => {
    it("should return valid when categoryId is undefined", () => {
      assertEquals(validationService.validateGetTopicsInput(undefined), {
        isValid: true,
      });
    });

    it("should return valid when categoryId is a valid positive integer", () => {
      assertEquals(validationService.validateGetTopicsInput("1"), {
        isValid: true,
      });
    });

    it("should return invalid when categoryId is zero", () => {
      assertEquals(validationService.validateGetTopicsInput("0"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });

    it("should return invalid when categoryId is negative", () => {
      assertEquals(validationService.validateGetTopicsInput("-1"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });

    it("should return invalid when categoryId is non-numeric", () => {
      assertEquals(validationService.validateGetTopicsInput("abc"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });
  });

  describe("validateAddTopicInput", () => {
    it("should return valid for a valid name and categoryId", () => {
      assertEquals(validationService.validateAddTopicInput("Topic 1", "1"), {
        isValid: true,
      });
    });

    it("should return valid when categoryId is undefined", () => {
      assertEquals(
        validationService.validateAddTopicInput("Topic 1", undefined),
        { isValid: true },
      );
    });

    it("should return invalid when categoryId is zero", () => {
      assertEquals(validationService.validateAddTopicInput("Topic 1", "0"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });

    it("should return invalid when categoryId is negative", () => {
      assertEquals(validationService.validateAddTopicInput("Topic 1", "-1"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });

    it("should return invalid when categoryId is non-numeric", () => {
      assertEquals(validationService.validateAddTopicInput("Topic 1", "abc"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });

    it("should return invalid when name is empty", () => {
      assertEquals(validationService.validateAddTopicInput("", "1"), {
        isValid: false,
        error: Messages.InvalidTopicName,
      });
    });

    it("should return invalid when name is whitespace only", () => {
      assertEquals(validationService.validateAddTopicInput("   ", "1"), {
        isValid: false,
        error: Messages.InvalidTopicName,
      });
    });

    it("should return categoryId error first when both are invalid", () => {
      assertEquals(validationService.validateAddTopicInput("", "abc"), {
        isValid: false,
        error: Messages.InvalidCategoryIdParam,
      });
    });
  });

  describe("validateCreateCategoryInput", () => {
    it("should return valid for a non-empty name", () => {
      assertEquals(
        validationService.validateCreateCategoryInput("Mathematics"),
        { isValid: true },
      );
    });

    it("should return invalid when name is empty", () => {
      assertEquals(validationService.validateCreateCategoryInput(""), {
        isValid: false,
        error: Messages.CategoryNameRequired,
      });
    });

    it("should return invalid when name is whitespace only", () => {
      assertEquals(validationService.validateCreateCategoryInput("   "), {
        isValid: false,
        error: Messages.CategoryNameRequired,
      });
    });
  });
});
