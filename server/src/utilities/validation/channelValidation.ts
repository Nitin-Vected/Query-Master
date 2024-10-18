import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewChannel = [
  body("channelName")
    .notEmpty()
    .withMessage("channel name is required")
    .isString()
    .withMessage("channel name must be a string"),
  checkValidation,
];

export const validateChannelId = [
  body("channelId")
    .optional()
    .isString()
    .withMessage("Channel ID must be a string")
    .matches(/^CHANNEL\d{4}$/)
    .withMessage('Channel ID must follow the format "CHANNEL" followed by 4 digits, e.g., "CHANNEL0001"'),
  checkValidation,
];

export const validateUpdateChannel = [
  body("channelId")
    .optional()
    .isString()
    .withMessage("Channel ID must be a string")
    .matches(/^CHANNEL\d{4}$/)
    .withMessage('Channel ID must follow the format "CHANNEL" followed by 4 digits, e.g., "CHANNEL0001"'),

  body("channelName")
    .optional()
    .isString()
    .withMessage("Channel name must be a string"),

  checkValidation,
];
