import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateUpdateLead = [
  param("leadId")
    .notEmpty()
    .withMessage("Lead ID is required")
    .isString()
    .withMessage("Lead ID must be a string")
    .matches(/^LEAD\d{4}$/)
    .withMessage('Lead ID must follow the format "LEAD" followed by 4 digits, e.g., "LEAD0001"'),

  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),

  body("email")
    .optional()
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email must be in a valid format"),

  body("contactNumber")
    .optional()
    .isString()
    .withMessage("Contact number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be exactly 10 digits")
    .matches(/^[0-9]+$/)
    .withMessage("Contact number must contain only digits (0-9)"),

  body("productAmount")
    .optional()
    .isNumeric()
    .withMessage("Product amount must be a number"),

  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number"),

  body("channelId")
    .optional()
    .isString()
    .withMessage("Channel ID must be a string")
    .matches(/^CHANNEL\d{4}$/)
    .withMessage('Channel ID must follow the format "CHANNEL" followed by 4 digits, e.g., "CHANNEL0001"'),

  body("statusId")
    .optional()
    .isString()
    .withMessage("Status ID must be a string")
    .matches(/^STATUS\d{4}$/)
    .withMessage('Status ID must follow the format "STATUS" followed by 4 digits, e.g., "STATUS0001"'),

  body("productId")
    .optional()
    .isString()
    .withMessage("Product ID must be a string")
    .matches(/^PRODUCT\d{4}$/)
    .withMessage('Product ID must follow the format "PRODUCT" followed by 4 digits, e.g., "PRODUCT0001"'),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("assignedTo")
    .optional()
    .isString()
    .withMessage("AssignedTo must be a string"),

  body("comment").optional().isString().withMessage("Comment must be a string"),

  checkValidation,
];

export const validateEnrollLead = [
  body("leadEmail")
    .notEmpty()
    .withMessage("Lead email is required")
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage(
      "Email must be in a valid format, including @ and a valid domain like '.com'"
    ),

  body("firstName")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("lastName")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .isString()
    .withMessage("Contact number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be exactly 10 digits")
    .matches(/^[0-9]+$/)
    .withMessage("Contact number must contain only digits (0-9)"),

  body("products").custom((value) => {
    if (typeof value === "string") {
      value = value.split(",");
    }

    if (!Array.isArray(value)) {
      throw new Error("Products must be an array");
    }

    value.forEach((item: string) => {
      if (typeof item !== "string") {
        throw new Error("Each product must be a string");
      }
      if (!/^PRODUCT\d{4}$/.test(item)) {
        throw new Error('Product ID must follow the format "PRODUCT" followed by 4 digits, e.g., "PRODUCT0001"');
      }
    });
    return true;
  }),

  body("paymentMode")
    .notEmpty()
    .withMessage("Payment mode is required")
    .isString()
    .withMessage("Payment mode must be a string"),

  body("finalAmount")
    .notEmpty()
    .withMessage("Final amount is required")
    .isNumeric()
    .withMessage("Final amount must be a number"),

  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number"),

  body("transactionAmount")
    .notEmpty()
    .withMessage("Transaction amount is required")
    .isNumeric()
    .withMessage("Transaction amount must be a number"),

  body("transactionDate")
    .notEmpty()
    .withMessage("Transaction date is required"),

  body("dueAmount")
    .optional()
    .isNumeric()
    .withMessage("Due amount must be a number"),

  body("dueDate").optional(),

  checkValidation,
];

export const validateAddNewLead = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .isString()
    .withMessage("Full Name must be a string"),

  body("leadEmail")
    .notEmpty()
    .withMessage("Lead email is required")
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Lead email must be in a valid format"),

  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .isString()
    .withMessage("Contact number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be exactly 10 digits")
    .matches(/^[0-9]+$/)
    .withMessage("Contact number must contain only digits (0-9)"),

  body("productAmount")
    .notEmpty()
    .withMessage("Product amount is required")
    .isNumeric()
    .withMessage("Product amount must be a number"),

  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number"),

  body("channelId")
    .optional()
    .isString()
    .withMessage("Channel ID must be a string")
    .matches(/^CHANNEL\d{4}$/)
    .withMessage('Channel ID must follow the format "CHANNEL" followed by 4 digits, e.g., "CHANNEL0001"'),

  body("statusId")
    .optional()
    .isString()
    .withMessage("Status ID must be a string")
    .matches(/^STATUS\d{4}$/)
    .withMessage('Status ID must follow the format "STATUS" followed by 4 digits, e.g., "STATUS0001"'),

  body("productId")
    .optional()
    .isString()
    .withMessage("Product ID must be a string")
    .matches(/^PRODUCT\d{4}$/)
    .withMessage('Product ID must follow the format "PRODUCT" followed by 4 digits, e.g., "PRODUCT0001"'),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  checkValidation,
];

export const validateGetLeadId = [
  param("leadId")
    .notEmpty()
    .withMessage("Lead ID is required")
    .isString()
    .withMessage("Lead ID must be a string")
    .matches(/^LEAD\d{4}$/)
    .withMessage(
      'Lead ID must follow the format "LEAD" followed by 4 digits, e.g., "LEAD0001"'
    ),

  checkValidation,
];
