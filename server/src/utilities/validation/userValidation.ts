import { body, check, param } from 'express-validator';
import { checkValidation } from './checkValidation';

export const userValidateRaiseQuery = [
    body('subject')
        .notEmpty()
        .withMessage('Subject is required')
        .isString()
        .withMessage('Subject must be a string')
        .isLength({ min: 5 })
        .withMessage('Subject must be at least 5 characters long'),

    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters long'),

    // Middleware to handle validation errors
    checkValidation,
];

export const userValidateAddContactNumber = [
    body('contactNumber')
        .exists()
        .withMessage('Contact number is required')
        .notEmpty()
        .withMessage('Contact number must not be empty')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact number must be exactly 10 digits')
        .matches(/^\d+$/)
        .withMessage('Contact number must contain only digits (0-9)'),

    // Middleware to handle validation errors
    checkValidation,
];

export const userValidateGetQueryData = [
    param('queryId')
        .exists()
        .withMessage('Query ID is required')
        .notEmpty()
        .withMessage('QueryId must not be empty')
        .isString()
        .withMessage('Query ID must be a string'),

    // Middleware to handle errors
    checkValidation,
]