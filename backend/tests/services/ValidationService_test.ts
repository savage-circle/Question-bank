import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { ValidationService } from "../../src/services/ValidationService.ts";
import LevelType from "../../src/enums/levelType.ts";

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

  describe("isStringArray", () => {
    it("should return true for an array of strings", () => {
      assertEquals(validationService.isStringArray(["a", "b"]), true);
    });

    it("should return true for an empty array", () => {
      assertEquals(validationService.isStringArray([]), true);
    });

    it("should return false for null", () => {
      assertEquals(validationService.isStringArray(null), false);
    });

    it("should return false for undefined", () => {
      assertEquals(validationService.isStringArray(undefined), false);
    });
  });

  describe("validateQuestionRequest", () => {
    it("should return valid for a valid request", () => {
      const result = validationService.validateQuestionRequest({ description: "Q1", topicId: 1, levelId: 1, extensions: [] });
      assertEquals(result, { isValid: true });
    });

    it("should return invalid if description is empty", () => {
      const result = validationService.validateQuestionRequest({ description: "", topicId: 1, levelId: 1, extensions: [] });
      assertEquals(result, { isValid: false, error: "Question description is required." });
    });

    it("should return invalid if topicId is not a positive integer", () => {
      const result = validationService.validateQuestionRequest({ description: "Q1", topicId: 0, levelId: 1, extensions: [] });
      assertEquals(result, { isValid: false, error: "Invalid topic id." });
    });

    it("should return invalid if levelId is not a valid enum value", () => {
      const result = validationService.validateQuestionRequest({ description: "Q1", topicId: 1, levelId: 99, extensions: [] });
      assertEquals(result, { isValid: false, error: "LevelId should be valid enum value" });
    });

    it("should return invalid if extensions is not a string array", () => {
      const result = validationService.validateQuestionRequest({ description: "Q1", topicId: 1, levelId: 1, extensions: [1, 2] as unknown as string[] });
      assertEquals(result, { isValid: false, error: "Extensions should be an array of non-empty strings." });
    });
  });
}
);