import { body } from "express-validator";
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
