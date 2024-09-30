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
  adminGetAllTransactionsController,
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
  getBatchByIdController,
  getCourseByIdController,
} from "../controller/adminController";

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
adminRouter.get("/adminGetAllPaymentDetails",adminGetAllTransactionsController);

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
 *     responses:
 *       201:
 *         description: Contact number added
 */
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);

/**
 * @swagger
 * /admin/addNewRole:
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
 */
adminRouter.post("/addNewRole", adminAddNewRoleController);

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
 *     responses:
 *       201:
 *         description: Status added
 */
adminRouter.post("/adminAddNewStatus", adminAddNewStatusController);

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
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               roleId:
 *                 type: string
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
 *               roleId:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
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
 * /admin/addNewBatch:
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
 *                 example: "trainer123"
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["student1", "student2", "student3"]
 *     responses:
 *       201:
 *         description: Batch created
 *       400:
 *         description: Invalid input
 */
adminRouter.post("/addNewBatch", adminAddNewBatchController);

// batchName, startDate, endDate, trainerId, courseId, students

/**
 * @swagger
 * /admin/getAllBatches:
 *   get:
 *     summary: Get All Batches
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all batches
 */
adminRouter.get("/getAllBatches", adminGetAllBatchController);


/**
 * @swagger
 * /admin/getBatchById/{batchId}:
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
adminRouter.get("/getBatchById/:batchId", getBatchByIdController); // students not coming

/**
 * @swagger
 * /admin/addNewCourse:
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
 *     responses:
 *       201:
 *         description: Course created
 */
adminRouter.post("/addNewCourse", adminAddNewCourseController);

/**
 * @swagger
 * /admin/getAllCourses:
 *   get:
 *     summary: Get All Courses
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all courses
 */
adminRouter.get("/getAllCourses", adminGetAllCourseController);

/**
 * @swagger
 * /admin/getCourseById/{courseId}:
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
adminRouter.get("/getCourseById/:courseId", getCourseByIdController);

export default adminRouter;
