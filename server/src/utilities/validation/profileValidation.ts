import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateUpdateProfile = [
  param("userId")
    .isString()
    .withMessage("User ID must be a string")
    .isLength({ min: 1 })
    .withMessage("User ID must not be empty"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("userEmail")
    .optional()
    .isEmail()
    .withMessage("User email must be a valid email"),
  body("contactNumber")
    .optional()
    .isString()
    .withMessage("Contact number must be a string"),
  body("roleId").optional().isString().withMessage("Role ID must be a string"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  checkValidation,
];
