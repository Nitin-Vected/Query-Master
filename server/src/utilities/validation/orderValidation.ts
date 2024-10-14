import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateOrderId = [
    param("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isString()
        .withMessage("Order ID must be a string")
        .matches(/\D/)
        .withMessage("Order ID cannot contain only numbers"),
    checkValidation,
];