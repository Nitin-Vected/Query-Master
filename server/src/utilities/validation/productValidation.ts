import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateNewProduct = [
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

export const validateProductId = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isString()
    .withMessage("Product ID must be a string")
    .matches(/^PRODUCT\d{4}$/)
    .withMessage('Product ID must follow the format "PRODUCT" followed by 4 digits, e.g., "PRODUCT0001"'),
  checkValidation,
];

export const validateUpdateProduct = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isString()
    .withMessage("Product ID must be a string")
    .matches(/^PRODUCT\d{4}$/)
    .withMessage('Product ID must follow the format "PRODUCT" followed by 4 digits, e.g., "PRODUCT0001"'),

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
    .withMessage("Product Fees must be a number")
    .isFloat({ gt: 0 })
    .withMessage('Product fees must be a number greater than zero'),

  body("productDescription")
    .optional()
    .isString()
    .withMessage("Product Description must be a string"),

  checkValidation,
];
