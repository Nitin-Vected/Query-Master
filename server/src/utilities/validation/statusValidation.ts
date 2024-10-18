import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewStatus = [
  body("statusName")
    .notEmpty()
    .withMessage("status name is required")
    .isString()
    .withMessage("status name must be a string"),

  checkValidation,
];

export const validateStatusId = [
  param("statusId")
    .notEmpty()
    .withMessage("Status ID is required")
    .isString()
    .withMessage("Status ID must be a string")
    .matches(/^STATUS\d{4}$/)
    .withMessage('Status ID must follow the format "STATUS" followed by 4 digits, e.g., "STATUS0001"'),
  checkValidation,
];

export const validateUpdateStatus = [
  param("statusId")
    .notEmpty()
    .withMessage("Status ID is required")
    .isString()
    .withMessage("Status ID must be a string")
    .matches(/^STATUS\d{4}$/)
    .withMessage('Status ID must follow the format "STATUS" followed by 4 digits, e.g., "STATUS0001"'),

  body("statusName")
    .optional()
    .isString()
    .withMessage("Status name must be a string"),

  checkValidation,
];
