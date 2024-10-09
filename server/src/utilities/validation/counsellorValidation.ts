import { body, check, param } from 'express-validator';
import { checkValidation } from './checkValidation';

export const counsellorValidateUpdateLead = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
        .withMessage("Email must be in a valid format, including @ and a valid domain like '.com'"),

    body("statusId")
        .notEmpty()
        .withMessage("Status ID is required")
        .isString()
        .withMessage("Status ID must be a string"),

    // Middleware to handle errors
    checkValidation,
];

export const counsellorValidateRegisterLeadAsUser = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[a-zA-Z][\w.-]*@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
        .withMessage("Email must be in a valid format, cannot start with a number, and must include '@' and a valid domain like '.com'"),

    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),

    body('contactNumber')
        .exists()
        .withMessage('Contact number is required')
        .notEmpty()
        .withMessage('Contact number must not be empty')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact number must be exactly 10 digits')
        .matches(/^\d+$/)
        .withMessage('Contact number must contain only digits (0-9)'),

    body('productPurchased')
        .isArray({ min: 1 })
        .withMessage('At least one course must be purchased'),

    body('paymentMode')
        .notEmpty()
        .withMessage('Payment mode is required'),

    body('paymentType')
        .notEmpty()
        .withMessage('Payment type is required'),

    body('finalAmount')
        .isNumeric()
        .withMessage('Final amount must be a valid number'),

    body('discount')
        .optional()
        .isNumeric()
        .withMessage('Discount must be a valid number'),

    body('statusId')
        .notEmpty()
        .withMessage('Status ID is required'),

    body('transactionAmount')
        .isNumeric()
        .withMessage('Transaction amount must be a valid number'),

    body('transactionDate')
        .isISO8601()
        .withMessage('Transaction date must be a valid date in ISO8601 format'),

    body('emiDetails')
        .optional()
        .isObject()
        .withMessage('EMI details must be an object'),

    body('emiDetails.emiCount')
        .optional()
        .isInt({ min: 1 })
        .withMessage('EMI count must be an integer greater than 0'),

    body('emiDetails.installments')
        .optional()
        .isArray()
        .withMessage('Installments must be an array'),

    check('emiDetails.installments.dueDate')
        .optional()
        .isISO8601()
        .withMessage('Installment due date must be a valid date'),

    check('emiDetails.installments.status')
        .optional()
        .isIn(['Paid', 'Pending'])
        .withMessage('Status must be one of: Paid, Pending'),

    // Middleware to handle errors
    checkValidation,
]

export const counsellorValidateAddNewLeads = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name must be a string'),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name must be a string'),

    body('contactNumber')
        .notEmpty()
        .withMessage('Contact number is required')
        .isString()
        .withMessage('Contact number must be a string')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact number must be exactly 10 digits')
        .matches(/^[0-9]+$/)
        .withMessage('Contact number must contain only digits (0-9)'),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
        .withMessage("Email must be in a valid format, including @ and a valid domain like '.com'"),

    body('finalAmount')
        .notEmpty()
        .withMessage('Fees amount is required')
        .isNumeric()
        .withMessage('Fees amount must be a number'),

    body('discount')
        .optional() // Make discount optional
        .isNumeric()
        .withMessage('Discount must be a number')
        .isFloat({ min: 0, max: 15 })
        .withMessage('Discount must be between 0 and 15'),

    body('channel')
        .notEmpty()
        .withMessage('Channel is required')
        .isString()
        .withMessage('Channel must be a string'),

    body('statusId')
        .notEmpty()
        .withMessage('Status ID is required')
        .isString()
        .withMessage('Status ID must be a string'),

    body('products')
        .isArray()
        .withMessage('Products must be an array')
        .custom((value) => {
            // Check if each item in the array is a string
            value.forEach((item: string) => {
                if (typeof item !== 'string') {
                    throw new Error('Each course must be a string');
                }
            });
            return true; // Indicate that the validation was successful
        }),

    // Middleware to handle errors
    checkValidation,
]

export const counsellorValidateGetLeadById = [
    param('leadId')
        .notEmpty()
        .withMessage('Lead ID is required')
        .isString()
        .withMessage('Lead ID must be a string')
        .custom(value => {
            if (!isNaN(Number(value))) {
                throw new Error('Lead ID should not be a number');
            }
            return true;
        }),

    // Middleware to handle validation errors
    checkValidation,
]