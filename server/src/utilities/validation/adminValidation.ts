import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const adminValidateNewRole = [
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

export const adminValidateRoleId = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .isString()
    .withMessage("Role ID must be a string"),
  checkValidation,
];

export const adminValidateUpdateRole = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .isString()
    .withMessage("Role ID must be a string"),

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

export const adminValidateNewStatus = [
  body("statusName")
    .notEmpty()
    .withMessage("status name is required")
    .isString()
    .withMessage("status name must be a string"),
];

export const adminValidateStatusId = [
  param("statusId")
    .notEmpty()
    .withMessage("Status ID is required")
    .isString()
    .withMessage("Status ID must be a string"),
  checkValidation,
];

export const adminValidateUpdateStatus = [
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

export const adminValidateNewChannel = [
  body("channelName")
    .notEmpty()
    .withMessage("channel name is required")
    .isString()
    .withMessage("channel name must be a string"),
];

export const adminValidateChannelId = [
  param("channelId")
    .notEmpty()
    .withMessage("Channel ID is required")
    .isString()
    .withMessage("Channel ID must be a string"),
  checkValidation,
];

export const adminValidateUpdateChannel = [
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

export const adminValidateNewProduct = [
  body("productName")
    .notEmpty()
    .withMessage("Course Name is required")
    .isString()
    .withMessage("Course Name must be a string"),

  body("productCategory")
    .notEmpty()
    .withMessage("Course Category is required")
    .isString()
    .withMessage("Course Category must be a string"),

  body("productFees")
    .notEmpty()
    .withMessage("Course Fees is required")
    .isNumeric()
    .withMessage("Course Fees must be a number"),

  body("productDescription")
    .notEmpty()
    .withMessage("Course Description is required")
    .isString()
    .withMessage("Course Description must be a string"),

  checkValidation,
];

export const adminValidateProductId = [
  param("productId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isString()
    .withMessage("Course ID must be a string"),
  checkValidation,
];

export const adminValidateUpdateProduct = [
  body("productName")
    .optional()
    .isString()
    .withMessage("Product Name must be a string"),

  body("productCategory")
    .optional()
    .isString()
    .withMessage("Product Category must be a string"),

  body("productFees")
    .optional()
    .isNumeric()
    .withMessage("Product Fees must be a number"),

  body("productDescription")
    .optional()
    .isString()
    .withMessage("Product Description must be a string"),

  checkValidation,
];
