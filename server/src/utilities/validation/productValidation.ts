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
    .withMessage("Course ID is required")
    .isString()
    .withMessage("Course ID must be a string"),
  checkValidation,
];

export const validateUpdateProduct = [
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
