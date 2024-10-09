import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewChannel = [
  body("channelName")
    .notEmpty()
    .withMessage("channel name is required")
    .isString()
    .withMessage("channel name must be a string"),
];

export const validateChannelId = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .isString()
    .withMessage("Channel ID must be a string"),
  checkValidation,
];

export const validateUpdateChannel = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .isString()
    .withMessage("Channel ID must be a string"),

  body("channelName")
    .optional()
    .isString()
    .withMessage("Channel name must be a string"),

  checkValidation,
];
