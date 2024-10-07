// src/routes/adminRouter.ts
import express from "express";
import {
  // adminAddContactNumberController,
  adminAddNewProductController,
  adminAddNewRoleController,
  adminAddNewStatusController,
  adminAuthenticateJWT,
  adminGetAllProductController,
//   adminRegisterEmployeesController,
//   adminGetAlltransactionListController,
  adminGetAllRolesController,
  // adminManageStudentStatusController,
  adminManageUsersAccessRightsController,
  // adminViewProfileController,
  adminViewStudentListController,
  adminViewSupportAdminListController,
  adminViewUserListController,
//   adminGetBatchByIdController,
  adminGetProductByIdController,
  adminGetRoleByIdController,
  adminGetRoleByUserIdController,
} from "../controller/adminController";
import { adminAccessRightsValidation, adminValidateContactNumber, adminValidateCourseDetails, adminValidateCourseId, adminValidateEmployeeDetails, adminValidateNewBatchDetails, adminValidateNewRole, adminValidateParams, adminValidateQueryData, adminValidateQueryResponse, adminValidateRoleId, adminValidateStatusName, adminValidateUserId } from "../utilities/validation/adminValidation";

const adminRouter = express.Router();

adminRouter.use(adminAuthenticateJWT);

// /**
//  * @swagger
//  * /admin/adminViewProfile:
//  *   get:
//  *     summary: View Admin Profile
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: Successful operation
//  */
// adminRouter.get("/adminViewProfile", adminViewProfileController);

/**
 * @swagger
 * /admin/student:
 *   get:
 *     summary: View List of Students
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/student", adminViewStudentListController);

// /**
//  * @swagger
//  * /admin/adminViewSupportAdminList:
//  *   get:
//  *     summary: View List of Support Admins
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: Successful operation
//  */
// adminRouter.get(
//   "/adminViewSupportAdminList",
//   adminViewSupportAdminListController
// );

/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: View List of Users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/user", adminViewUserListController);

// /**
//  * @swagger
//  * /admin/adminManageStudentStatus/{email}/{action}:
//  *   get:
//  *     summary: Manage Student Status
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: email
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Email of the student
//  *       - in: path
//  *         name: action
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Action to be taken on the student (true/false)
//  *     responses:
//  *       200:
//  *         description: Student status updated
//  */
// adminRouter.get(
//   "/adminManageStudentStatus/:email/:action",
//   adminManageStudentStatusController
// );

// /**
//  * @swagger
//  * /admin/adminAddContactNumber:
//  *   post:
//  *     summary: Add Contact Number
//  *     tags: [Admin]
//  *     requestBody:
//  *       description: Contact number details
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               contactNumber:
//  *                 type: string
//  *                 example: "9876543210"
//  *     responses:
//  *       201:
//  *         description: Contact number added
//  */
// adminRouter.post("/adminAddContactNumber", adminValidateContactNumber, adminAddContactNumberController);

/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Add New Role
 *     tags: [Admin]
 *     requestBody:
 *       description: Role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRole:
 *                 type: string
 *               access:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.post("/role", adminValidateNewRole, adminAddNewRoleController);

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Get All Roles
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all Roles
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/role", adminGetAllRolesController);

/**
 * @swagger
 * /admin/role/{roleId}:
 *   get:
 *     summary: Get Role by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role
 *     responses:
 *       200:
 *         description: Role details retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/role/:roleId", adminValidateRoleId, adminGetRoleByIdController);

/**
 * @swagger
 * /admin/status:
 *   post:
 *     summary: Add New Status
 *     tags: [Admin]
 *     requestBody:
 *       description: Status details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusName:
 *                 type: string
 *                 example: "enrolled"
 *     responses:
 *       201:
 *         description: Status added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.post("/status", adminAddNewStatusController);

// /**
//  * @swagger
//  * /admin/adminAddAccessRights:
//  *   post:
//  *     summary: Manage User Access Rights
//  *     tags: [Admin]
//  *     requestBody:
//  *       description: Access rights data
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: string
//  *                 example: "USERlzRn-QO8q02"
//  *               roleId:
//  *                 type: string
//  *                 example: "ROLEtEUJrkc0r04"
//  *               permissions:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["View Trainer Profile"]
//  *     responses:
//  *       201:
//  *         description: Access rights updated
//  */
// adminRouter.post("/adminAddAccessRights", adminAccessRightsValidation, adminManageUsersAccessRightsController);

// /**
//  * @swagger
//  * /admin/adminGetAllPaymentDetails:
//  *   get:
//  *     summary: Get all payment List
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: Payment List Retrieved
//  */
// adminRouter.get("/adminGetAllPaymentDetails",adminGetAlltransactionListController);


// /**
//  * @swagger
//  * /admin/adminRegisterEmployees:
//  *   post:
//  *     summary: Register Employees
//  *     tags: [Admin]
//  *     requestBody:
//  *       description: Employee registration data
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "John"
//  *               email:
//  *                 type: string
//  *                 example: "Doe"
//  *               contactNumber:
//  *                 type: string
//  *                 example: "9876543210"
//  *               roleId:
//  *                 type: string
//  *                 example: "ROLEtEUJrkc0r04"
//  *     responses:
//  *       201:
//  *         description: Employees registered
//  */
// adminRouter.post("/adminRegisterEmployees", adminRegisterEmployeesController);

// /**
//  * @swagger
//  * /admin/addNewBatch:
//  *   post:
//  *     summary: Add a New Batch
//  *     tags: [Admin]
//  *     requestBody:
//  *       description: Batch data
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               batchName:
//  *                 type: string
//  *                 example: "Batch 1"
//  *               startDate:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-09-30"
//  *               endDate:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-12-30"
//  *               trainerId:
//  *                 type: string
//  *                 example: "USERr2T89NnpD0711"
//  *               courseId:
//  *                 type: string
//  *                 example: "COURSEuBeLY8e0b02"
//  *               students:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["10VSA0001", "10VSA0002", "10VSA0003"]
//  *     responses:
//  *       201:
//  *         description: Batch created
//  *       400:
//  *         description: Invalid input
//  */
// adminRouter.post("/addNewBatch", adminAddNewBatchController);

// /**
//  * @swagger
//  * /admin/getAllBatches:
//  *   get:
//  *     summary: Get All Batches
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: List of all batches
//  */
// adminRouter.get("/getAllBatches", adminGetAllBatchController);

// /**
//  * @swagger
//  * /admin/getBatchById/{batchId}:
//  *   get:
//  *     summary: Get Batch by ID
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: batchId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the batch
//  *     responses:
//  *       200:
//  *         description: Batch details retrieved
//  */
// adminRouter.get("/getBatchById/:batchId", getBatchByIdController); // students not coming

/**
 * @swagger
 * /admin/product:
 *   post:
 *     summary: Add a New Course
 *     tags: [Admin]
 *     requestBody:
 *       description: Course data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.post("/product",adminValidateCourseDetails, adminAddNewProductController);

/**
 * @swagger
 * /admin/product:
 *   get:
 *     summary: Get All Products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all Products
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/product", adminGetAllProductController);

/**
 * @swagger
 * /admin/product/{productId}:
 *   get:
 *     summary: Get Product by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Product
 *     responses:
 *       200:
 *         description: Product details retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/product/:productId",adminValidateCourseId, adminGetProductByIdController);

/**
 * @swagger
 * /admin/product/{productId}:
 *   put:
 *     summary: Update Product by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Product to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */


export default adminRouter;