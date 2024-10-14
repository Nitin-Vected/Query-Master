import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateTransaction = [
  body("paymentMode").notEmpty().withMessage("Payment mode is required."),
  body("transactionDate")
    .isString()
    .withMessage("Transaction date must be a string."),
  body("transactionAmount")
    .isFloat({ gt: 0 })
    .withMessage("Transaction amount must be a positive number."),
  body("orderId").notEmpty().withMessage("Order ID is required."),
  checkValidation,
];

export const validateTransactionId = [
  param("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string")
    .matches(/\D/)
    .withMessage("Order ID cannot contain only numbers"),
  checkValidation,
];
