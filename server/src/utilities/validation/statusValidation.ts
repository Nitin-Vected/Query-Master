import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewStatus = [
  body("statusName")
    .notEmpty()
    .withMessage("status name is required")
    .isString()
    .withMessage("status name must be a string"),
];

export const validateStatusId = [
  param("statusId")
    .notEmpty()
    .withMessage("Status ID is required")
    .isString()
    .withMessage("Status ID must be a string"),
  checkValidation,
];

export const validateUpdateStatus = [
  param("statusId")
    .notEmpty()
    .withMessage("Status ID is required")
    .isString()
    .withMessage("Status ID must be a string"),

  body("statusName")
    .optional()
    .isString()
    .withMessage("Status name must be a string"),

  checkValidation,
];
