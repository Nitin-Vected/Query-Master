import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateTransaction = [
  body("transactionMode").notEmpty().withMessage("Payment mode is required."),
  body("transactionDate")
    .isString()
    .withMessage("Transaction date must be a string."),
  body("transactionAmount")
    .isFloat({ gt: 0 })
    .withMessage("Transaction amount must be a positive number."),
  body("orderId").notEmpty()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string")
    .matches(/^ORDER\d{4}$/)
    .withMessage('Order ID must follow the format "ORDER" followed by 4 digits, e.g., "ORDER0001"'),
  checkValidation,
];

export const validateTransactionId = [
  param("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string")
    .matches(/^TRANSACTION\d{4}$/)
    .withMessage('Transaction ID must follow the format "TRANSACTION" followed by 4 digits, e.g., "TRANSACTION0001"'),
  checkValidation,
];
