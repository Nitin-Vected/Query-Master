// src/routes/adminRouter.ts
import express from "express";
import {
  adminAddContactNumberController,
  adminAddNewBatchController,
  adminAddNewCourseController,
  adminAddNewRoleController,
  adminAddNewStatusController,
  adminAuthenticateJWT,
  adminGetAllBatchController,
  adminGetAllCourseController,
  adminGetAlltransactionListController,
  adminGetAllRolesController,
  adminGetQueryDataController,
  adminManageQueryStatusController,
  adminManageStudentStatusController,
  adminManageUsersAccessRightsController,
  adminRaiseQueryController,
  adminRegisterEmployeesController,
  adminResponseController,
  adminViewProfileController,
  adminViewRaisedQueryListController,
  adminViewStudentListController,
  adminViewSupportAdminListController,
  adminViewUserListController,
  adminGetBatchByIdController,
  adminGetCourseByIdController,
  adminGetRoleByIdController,
  adminGetRoleByUserIdController,
} from "../controller/adminController";
import { adminValidateStatusName } from "../utilities/validation/adminValidation";

const adminRouter = express.Router();

adminRouter.use(adminAuthenticateJWT);

/**
 * @swagger
 * /admin/adminViewProfile:
 *   get:
 *     summary: View Admin Profile
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get("/adminViewProfile", adminViewProfileController);

/**
 * @swagger
 * /admin/adminViewStudentList:
 *   get:
 *     summary: View List of Students
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get("/adminViewStudentList", adminViewStudentListController);

/**
 * @swagger
 * /admin/adminViewRaisedQueries:
 *   get:
 *     summary: View List of Raised Queries
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get("/adminViewRaisedQueries", adminViewRaisedQueryListController);

/**
 * @swagger
 * /admin/adminGetQueryData/{queryId}:
 *   get:
 *     summary: Get Query Data by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         description: ID of the query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Query data retrieved
 */
adminRouter.get("/adminGetQueryData/:queryId", adminGetQueryDataController);


/**
 * @swagger
 * /admin/adminGetAllPaymentDetails:
 *   get:
 *     summary: Get all payment List
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Payment List Retrieved
 */
adminRouter.get("/adminGetAllPaymentDetails", adminGetAlltransactionListController);

/**
 * @swagger
 * /admin/adminViewSupportAdminList:
 *   get:
 *     summary: View List of Support Admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get(
  "/adminViewSupportAdminList",
  adminViewSupportAdminListController
);

/**
 * @swagger
 * /admin/adminViewUserList:
 *   get:
 *     summary: View List of Users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get("/adminViewUserList", adminViewUserListController);

/**
 * @swagger
 * /admin/adminManageQueryStatus/{queryId}/{status}:
 *   post:
 *     summary: Manage Query Status
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the query
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status of the query
 *     responses:
 *       200:
 *         description: Query status updated
 */
adminRouter.post(
  "/adminManageQueryStatus/:queryId/:status",
  adminManageQueryStatusController
);

/**
 * @swagger
 * /admin/adminManageStudentStatus/{email}/{action}:
 *   get:
 *     summary: Manage Student Status
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the student
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *         description: Action to be taken on the student (true/false)
 *     responses:
 *       200:
 *         description: Student status updated
 */
adminRouter.get(
  "/adminManageStudentStatus/:email/:action",
  adminManageStudentStatusController
);

/**
 * @swagger
 * /admin/adminRaiseQuery:
 *   post:
 *     summary: Raise a Query
 *     tags: [Admin]
 *     requestBody:
 *       description: Query details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               queryTitle:
 *                 type: string
 *               queryDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Query raised
 */
adminRouter.post("/adminRaiseQuery", adminRaiseQueryController);

/**
 * @swagger
 * /admin/adminAddResponseToQuery/{queryId}:
 *   post:
 *     summary: Add Response to Query
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the query
 *     requestBody:
 *       description: Response to the query
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response added
 */
adminRouter.post("/adminAddResponseToQuery/:queryId", adminResponseController);

/**
 * @swagger
 * /admin/adminAddContactNumber:
 *   post:
 *     summary: Add Contact Number
 *     tags: [Admin]
 *     requestBody:
 *       description: Contact number details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Contact number added
 */
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);

/**
 * @swagger
 * /admin/adminAddNewRole:
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
 *                 example: "Student"
 *               access:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Student001"
 *     responses:
 *       201:
 *         description: Role added
 */
adminRouter.post("/adminAddNewRole", adminAddNewRoleController);

/**
 * @swagger
 * /admin/adminGetRoleByUserId/{userId}:
 *   get:
 *     summary: Get Role by User ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role by User ID
 *     responses:
 *       200:
 *         description: Role details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Unique ID of the role
 *                   example: "USERxyz123"
 *       400:
 *         description: Bad request or missing parameters
 *       404:
 *         description: Role of User not found
 */
adminRouter.get("/adminGetRoleByUserId/:userId", adminGetRoleByUserIdController);

/**
 * @swagger
 * /admin/adminGetRoleById/{roleId}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roleId:
 *                   type: string
 *                   description: Unique ID of the role
 *                   example: "ROLE123"
 *       400:
 *         description: Bad request or missing parameters
 *       404:
 *         description: Role not found
 */
adminRouter.get("/adminGetRoleById/:roleId", adminGetRoleByIdController);

/**
 * @swagger
 * /admin/adminAddNewStatus:
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
 */
adminRouter.post("/adminAddNewStatus", adminValidateStatusName, adminAddNewStatusController);

/**
 * @swagger
 * /admin/adminRegisterEmployees:
 *   post:
 *     summary: Register Employees
 *     tags: [Admin]
 *     requestBody:
 *       description: Employee registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John"
 *               email:
 *                 type: string
 *                 example: "Doe"
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *               roleId:
 *                 type: string
 *                 example: "ROLEtEUJrkc0r04"
 *     responses:
 *       201:
 *         description: Employees registered
 */
adminRouter.post("/adminRegisterEmployees", adminRegisterEmployeesController);

/**
 * @swagger
 * /admin/adminAddAccessRights:
 *   post:
 *     summary: Manage User Access Rights
 *     tags: [Admin]
 *     requestBody:
 *       description: Access rights data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "USERlzRn-QO8q02"
 *               roleId:
 *                 type: string
 *                 example: "ROLEtEUJrkc0r04"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["View Trainer Profile"]
 *     responses:
 *       201:
 *         description: Access rights updated
 */
adminRouter.post(
  "/adminAddAccessRights",
  adminManageUsersAccessRightsController
);

/**
 * @swagger
 * /admin/adminAddNewBatch:
 *   post:
 *     summary: Add a New Batch
 *     tags: [Admin]
 *     requestBody:
 *       description: Batch data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               batchName:
 *                 type: string
 *                 example: "Batch 1"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-30"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-30"
 *               trainerId:
 *                 type: string
 *                 example: "USERr2T89NnpD0711"
 *               courseId:
 *                 type: string
 *                 example: "COURSEuBeLY8e0b02"
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["10VSA0001", "10VSA0002", "10VSA0003"]
 *     responses:
 *       201:
 *         description: Batch created
 *       400:
 *         description: Invalid input
 */
adminRouter.post("/adminAddNewBatch", adminAddNewBatchController);

// batchName, startDate, endDate, trainerId, courseId, students

/**
 * @swagger
 * /admin/adminGetAllBatches:
 *   get:
 *     summary: Get All Batches
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all batches
 */
adminRouter.get("/adminGetAllBatches", adminGetAllBatchController);

/**
 * @swagger
 * /admin/adminGetBatchById/{batchId}:
 *   get:
 *     summary: Get Batch by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the batch
 *     responses:
 *       200:
 *         description: Batch details retrieved
 */
adminRouter.get("/adminGetBatchById/:batchId", adminGetBatchByIdController); // students not coming

/**
 * @swagger
 * /admin/adminAddNewCourse:
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
 *               courseName:
 *                 type: string
 *                 example: "MERN Stack"
 *               courseCategory:
 *                 type: string
 *                 example: "Web Development"
 *               courseFees:
 *                 type: number
 *                 example: 24999
 *               courseDescription:
 *                 type: string
 *                 example: "This course covers modern web development techniques."
 *     responses:
 *       201:
 *         description: Course created
 */
adminRouter.post("/adminAddNewCourse", adminAddNewCourseController);

/**
 * @swagger
 * /admin/adminGetAllCourses:
 *   get:
 *     summary: Get All Courses
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all courses
 */
adminRouter.get("/adminGetAllCourses", adminGetAllCourseController);

/**
 * @swagger
 * /admin/adminGetAllRoles:
 *   get:
 *     summary: Get All Roles
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all Roles
 */
adminRouter.get("/adminGetAllRoles", adminGetAllRolesController);

/**
 * @swagger
 * /admin/adminGetCourseById/{courseId}:
 *   get:
 *     summary: Get Course by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course details retrieved
 */
adminRouter.get("/adminGetCourseById/:courseId", adminGetCourseByIdController);

export default adminRouter;