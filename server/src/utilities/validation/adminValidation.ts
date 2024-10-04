import { body, param } from 'express-validator';
import { checkValidation } from './checkValidation';

// Combined validation and error handling middleware
export const adminValidateStatusName = [
  body("statusName")
    .notEmpty()
    .withMessage("Status Name is required")
    .isString()
    .withMessage("Status Name must be a string")
    .matches(/[a-zA-Z]{2,}/)
    .withMessage("Status Name must contain at least two letters and not be only numbers"),
  checkValidation,
];

// export const adminValidateParams = [
//   param("queryId")
//     .notEmpty()
//     .withMessage("Query ID is required")
//     .isString()
//     .withMessage("Query ID must be a valid String"),
//   checkValidation,
// ];

export const adminValidateParams = (paramName: string) => [
  param(paramName).exists({ checkFalsy: true })
    .exists({ checkFalsy: true }) // Ensure parameter exists and is not falsy
    .withMessage(`${paramName} is required`)
    .isString()
    .withMessage(`${paramName} must be a valid string`),
  checkValidation,
];

export const adminValidateQueryData = [
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isString()
    .withMessage("Subject must be a string")
    .isLength({ min: 2 })
    .withMessage("Subject must be at least 2 characters long"),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),

  checkValidation,
];

export const adminValidateQueryResponse = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),

  checkValidation,
];

export const adminValidateContactNumber = [
  body("contactNumber")
    .notEmpty()
    .withMessage("Contact Number is required")
    .isString()
    .withMessage("Contact Number must be a string")
    .matches(/^[6-9][0-9]{9}$/)
    .withMessage("Contact Number must start with a digit between 6 and 9 and be exactly 10 digits long"),

  checkValidation,
];
export const adminValidateNewRole = [
  body("userRole")
    .notEmpty()
    .withMessage("User Role is required")
    .isString()
    .withMessage("User Role must be a string"),

  body("access")
    .notEmpty()
    .withMessage("Access is required")
    .isArray()
    .withMessage("Access must be an array")
    .custom((accessArray) => accessArray.every((item: any) => typeof item === 'string'))
    .withMessage("All elements in the access array must be strings"),
  checkValidation,
];

export const adminValidateRoleId = [
  param("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .isString()
    .withMessage("Role ID must be a string"),
  checkValidation,
];

export const adminValidateUserId = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string"),
  checkValidation,
];
export const adminValidateCourseId = [
  param("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isString()
    .withMessage("Course ID must be a string"),
  checkValidation,
];

export const adminValidateEmployeeDetails = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .matches(/^[A-Za-z][^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Email must start with a letter and be a valid email address"),

  body("contactNumber")
    .notEmpty()
    .withMessage("Contact Number is required")
    .isString()
    .withMessage("Contact Number must be a string")
    .matches(/^[6-9][0-9]{9}$/)
    .withMessage("Contact Number must start with a digit between 6 and 9 and be exactly 10 digits long"),

  body("roleId")
    .notEmpty()
    .withMessage("Role ID is required")
    .isString()
    .withMessage("Role ID must be a string"),

  checkValidation,
];


export const adminAccessRightsValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User Id is required")
    .isString()
    .withMessage("User ID must be a string"),

  body("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role ID must be a string"),

  body("permissions")
    .notEmpty()
    .withMessage("Access is required")
    .isArray()
    .withMessage("Access must be an array")
    .custom((permissionsArray) => permissionsArray.every((item: any) => typeof item === 'string'))
    .withMessage("All elements in the access array must be strings"),

  checkValidation,
];

export const adminValidateNewBatchDetails = [
  body("batchName")
    .notEmpty()
    .withMessage("Batch Name is required")
    .isString()
    .withMessage("Batch Name must be a string"),

  body("startDate")
    .notEmpty()
    .withMessage("Start Date is required")
    .isISO8601()
    .withMessage("Start Date must be a valid date in ISO 8601 format"), // ISO 8601 format validation

  body("endDate")
    .notEmpty()
    .withMessage("End Date is required")
    .isISO8601()
    .withMessage("End Date must be a valid date in ISO 8601 format"), // ISO 8601 format validation

  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isString()
    .withMessage("Course ID must be a string"),

  body("students")
    .notEmpty()
    .withMessage("Students is required")
    .isArray()
    .withMessage("Students must be an array")
    .custom((studentsArray) => studentsArray.every((item: any) => typeof item === 'string'))
    .withMessage("All elements in the students array must be strings"),

  checkValidation,
];


export const adminValidateCourseDetails = [
  body("courseName")
    .notEmpty()
    .withMessage("Course Name is required")
    .isString()
    .withMessage("Course Name must be a string"),

  body("courseCategory")
    .notEmpty()
    .withMessage("Course Category is required")
    .isString()
    .withMessage("Course Category must be a string"),

  body("courseFees")
    .notEmpty()
    .withMessage("Course Fees is required")
    .isNumeric()
    .withMessage("Course Fees must be a number")
    .isFloat({ gt: 1000 })
    .withMessage("Course Fees must be greater than 1000"),

  body("courseDescription")
    .notEmpty()
    .withMessage("Course Description is required")
    .isString()
    .withMessage("Course Description must be a string"),

  checkValidation,
];



// export const adminValidate 