import { body } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateCreateUser = [
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("leadEmail").isEmail().withMessage("Valid email is required."),
  body("contactNumber")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Contact number must be at least 10 characters long."),
  checkValidation,
];
