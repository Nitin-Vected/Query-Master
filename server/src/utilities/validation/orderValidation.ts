import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateOrderId = [
    param("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isString()
        .withMessage("Order ID must be a string")
        .matches(/^ORDER\d{4}$/)
        .withMessage('Order ID must follow the format "ORDER" followed by 4 digits, e.g., "ORDER0001"'),
    checkValidation,
];