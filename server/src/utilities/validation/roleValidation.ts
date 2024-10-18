import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewRole = [
  body("userRole")
    .notEmpty()
    .withMessage("User Role is required")
    .isString()
    .withMessage("User Role must be a string"),

  body("access")
    .notEmpty()
    .withMessage("Access is required")
    .isArray()
    .withMessage("Access must be an array")
    .custom((accessArray) =>
      accessArray.every((item: any) => typeof item === "string")
    )
    .withMessage("All elements in the access array must be strings"),
  checkValidation,
];

export const validateRoleId = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .isString()
    .withMessage("Role ID must be a string")
    .matches(/^ROLE\d{4}$/)
    .withMessage('Role ID must follow the format "ROLE" followed by 4 digits, e.g., "ROLE0001"'),
  checkValidation,
];

export const validateUpdateRole = [
  param("roleId")
  .notEmpty()
  .withMessage("Role ID is required")
  .isString()
  .withMessage("Role ID must be a string")
  .matches(/^ROLE\d{4}$/)
  .withMessage('Role ID must follow the format "ROLE" followed by 4 digits, e.g., "ROLE0001"'),

  body("userRole")
    .optional()
    .isString()
    .withMessage("User role must be a string"),

  body("access")
    .optional()
    .isArray()
    .withMessage("Access must be an array of strings")
    .custom((value) => {
      if (value.some((item: string) => typeof item !== "string")) {
        throw new Error("Each access item must be a string");
      }
      return true;
    }),

  checkValidation,
];
