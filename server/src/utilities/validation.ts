import { check } from "express-validator";

export const loginValidationRules = [
    console.log('inside loginValidations ...!');
    check('tokenResponse.access_token')
        .notEmpty().withMessage('Access token is required')
        .isString().withMessage('Access token must be a string'),
];