// src/routes/userRouter.ts
import express, { Request } from "express";
import { loginController } from "../controller/loginController";
import {
  authenticateJWT,
  authenticationController,
} from "../controller/authController";
import {
  addNewRoleController,
  getAllRolesController,
  getRoleByIdController,
  updateRoleController,
} from "../controller/roleController";
import {
  addNewProductController,
  getAllProductController,
  getProductByIdController,
  updateProductByIdController,
} from "../controller/productController";
import {
  addNewStatusController,
  getAllStatusController,
  getStatusByIdController,
  updateStatusController,
} from "../controller/statusController";
import {
  addNewChannelController,
  getAllChannelsController,
  getChannelByIdController,
  updateChannelController,
} from "../controller/channelController";
import {
  validateNewRole,
  validateRoleId,
  validateUpdateRole,
} from "../utilities/validation/roleValidation";
import {
  validateNewStatus,
  validateStatusId,
  validateUpdateStatus,
} from "../utilities/validation/statusValidation";
import {
  validateChannelId,
  validateNewChannel,
  validateUpdateChannel,
} from "../utilities/validation/channelValidation";
import {
  validateNewProduct,
  validateProductId,
  validateUpdateProduct,
} from "../utilities/validation/productValidation";
import {
  viewConsellorListController,
  viewStudentListController,
  viewUserListController,
} from "../controller/userListController";
import { viewProfileController } from "../controller/profileController";
import { addNewLeadController, enrollLeadController, getAllLeadsController, getLeadByIdController, updateLeadController } from "../controller/leadController";
import { uploadTransactionProof } from "../utilities/multer";
import { validateAddNewLead, validateEnrollLead, validateGetLeadById, validateUpdateLead } from "../utilities/validation/leadValidation";

const apiRouter = express.Router();

apiRouter.post("/login", loginController);

/**
 * @swagger
 * /api/authentication:
 *   get:
 *     summary: User Authentication
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/authentication", authenticationController);

apiRouter.use(authenticateJWT);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: View Profile
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: Successful operation
 */
apiRouter.get("/profile", viewProfileController);

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: View List of Students
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/student", viewStudentListController);

/**
 * @swagger
 * /api/consellor:
 *   get:
 *     summary: View List of Counsellor
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: Successful operation
 */
apiRouter.get("/consellor", viewConsellorListController);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: View List of Users
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/user", viewUserListController);

/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Add New Role
 *     tags: [Api]
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
 *                 example: Trainer
 *               access:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example:
 *                    - view profile
 *                    - edit profile
 *     responses:
 *       201:
 *         description: Role added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.post("/role", validateNewRole, addNewRoleController);

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get All Roles
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of all Roles
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/role", getAllRolesController);

/**
 * @swagger
 * /api/role/{roleId}:
 *   get:
 *     summary: Get Role by ID
 *     tags: [Api]
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
apiRouter.get("/role/:roleId", validateRoleId, getRoleByIdController);

/**
 * @swagger
 * /api/role/{roleId}:
 *   put:
 *     summary: Update Role
 *     tags: [Api]
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: ID of the role to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRole:
 *                 type: string
 *                 example: Trainer
 *               access:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example:
 *                    - view profile
 *                    - edit profile
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
apiRouter.put("/role/:roleId", validateUpdateRole, updateRoleController);

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: Add New Status
 *     tags: [Api]
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
apiRouter.post("/status", validateNewStatus, addNewStatusController);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get All Status
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of all Status
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/status", getAllStatusController);

/**
 * @swagger
 * /api/status/{statusId}:
 *   get:
 *     summary: Get Status by ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the status
 *     responses:
 *       200:
 *         description: Status details retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/status/:statusId", validateStatusId, getStatusByIdController);

/**
 * @swagger
 * /api/status/{statusId}:
 *   put:
 *     summary: Update Status
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the status
 *     requestBody:
 *       description: Updated status details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusName:
 *                 type: string
 *                 example: "Interested"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Status not found
 *       500:
 *         description: Internal server error
 */
apiRouter.put(
  "/status/:statusId",
  validateUpdateStatus,
  updateStatusController
);

/**
 * @swagger
 * /api/channel:
 *   post:
 *     summary: Add New Channel
 *     tags: [Api]
 *     requestBody:
 *       description: Channel details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelName:
 *                 type: string
 *                 example: "Instagram"
 *     responses:
 *       201:
 *         description: Channel added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.post("/channel", validateNewChannel, addNewChannelController);

/**
 * @swagger
 * /api/channel:
 *   get:
 *     summary: Get All Channel
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of all Channel
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/channel", getAllChannelsController);

/**
 * @swagger
 * /api/channel/{channelId}:
 *   get:
 *     summary: Get Channel by ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the channel
 *     responses:
 *       200:
 *         description: Channel details retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get(
  "/channel/:channelId",
  validateChannelId,
  getChannelByIdController
);

/**
 * @swagger
 * /api/channel/{channelId}:
 *   put:
 *     summary: Update Channel
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the channel
 *     requestBody:
 *       description: Updated channel details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelName:
 *                 type: string
 *                 example: "Instagram"
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
apiRouter.put(
  "/channel/:channelId",
  validateUpdateChannel,
  updateChannelController
);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Add a New Course
 *     tags: [Api]
 *     requestBody:
 *       description: Course data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Data Analyst
 *               productCategory:
 *                 type: string
 *                 example: Data Science
 *               productFees:
 *                 type: number
 *                 example: 30000
 *               productDescription:
 *                 type: string
 *                 example: Become a skilled Data Analyst by mastering data visualization, data cleaning, statistical analysis, and data modeling techniques.
 *               image:
 *                 type: string
 *                 example: https://randomsite.com/images/data-analyst-course.jpg
 *               document:
 *                 type: string
 *                 example: https://randomsite.com/docs/data-analyst-syllabus.pdf
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.post("/product", validateNewProduct, addNewProductController);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get All Products
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of all Products
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/product", getAllProductController);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get Product by ID
 *     tags: [Api]
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
apiRouter.get(
  "/product/:productId",
  validateProductId,
  getProductByIdController
);

/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     summary: Update Product by ID
 *     tags: [Api]
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
 *               productName:
 *                 type: string
 *                 description: Updated name of the product
 *                 example: "New Product Name"
 *               productCategory:
 *                 type: string
 *                 description: Updated category of the product
 *                 example: "Electronics"
 *               productFees:
 *                 type: number
 *                 description: Updated price/fees of the product
 *                 example: 5000
 *               productDescription:
 *                 type: string
 *                 description: Updated description of the product
 *                 example: "A high-quality product"
 *               image:
 *                 type: string
 *                 description: URL of the updated product image
 *                 example: "https://example.com/image.jpg"
 *               document:
 *                 type: string
 *                 description: URL of the updated product document
 *                 example: "https://example.com/document.pdf"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request (Invalid data)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
apiRouter.put(
  "/product/:productId",
  validateUpdateProduct,
  updateProductByIdController
);

/**
 * @swagger
 * /api/lead:
 *   post:
 *     summary: Add a new lead
 *     tags: [Api]
 *     requestBody:
 *       description: Lead information to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               leadEmail:
 *                 type: string
 *                 example: john.doe@gmail.com
 *               contactNumber:
 *                 type: string
 *                 example: 9874569874
 *               productAmount:
 *                 type: number
 *                 example: 25000
 *               discount:
 *                 type: number
 *                 example: 1000
 *               channelId:
 *                 type: string
 *                 example: CHANNEL0001
 *               statusId:
 *                 type: string
 *                 example: STATUS0001
 *               productId:
 *                 type: string
 *                 example: PRODUCT0001
 *               description:
 *                 type: string
 *                 example: interested in full stack course
 *     responses:
 *       201:
 *         description: Lead added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.post("/lead", validateAddNewLead, addNewLeadController);

/**
 * @swagger
 * /api/lead:
 *   get:
 *     summary: Retrieve all leads
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of all leads
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get("/lead", getAllLeadsController);

/**
 * @swagger
 * /api/lead/{leadId}:
 *   get:
 *     summary: Get Lead by ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead details retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.get(
  "/lead/:leadId",
  validateGetLeadById,
  getLeadByIdController
);

/**
 * @swagger
 * /api/lead/{leadId}:
 *   put:
 *     summary: Update a lead
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The lead ID
 *     requestBody:
 *       description: Lead information to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@gmail.com
 *               contactNumber:
 *                 type: string
 *                 example: 9874569874
 *               productAmount:
 *                 type: number
 *                 example: 25000
 *               discount:
 *                 type: number
 *                 example: 1000
 *               channelId:
 *                 type: string
 *                 example: CHANNEL0001
 *               statusId:
 *                 type: string
 *                 example: STATUS0001
 *               productId:
 *                 type: string
 *                 example: PRODUCT0001
 *               description:
 *                 type: string
 *                 example: Interested in full stack course
 *               assignedTo:
 *                 type: string
 *                 example: COUNSELLOR001
 *               comment:
 *                 type: string
 *                 example: Lead is very interested in the course
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
apiRouter.put(
  "/lead/:leadId",
  validateUpdateLead,
  updateLeadController
);

/**
 * @swagger
 * /api/enrollLead:
 *   post:
 *     summary: Enroll a lead as a student and add transaction details
 *     tags: [Api]
 *     requestBody:
 *       description: Transaction details along with proof file
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               leadEmail:
 *                 type: string
 *               name:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentMode:
 *                 type: string
 *               finalAmount:
 *                 type: string
 *               discount:
 *                 type: number
 *               transactionProof:
 *                 type: string
 *                 format: binary
 *               transactionAmount:
 *                 type: number
 *               transactionDate:
 *                 type: string
 *               dueAmount:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student enrolled and transaction details added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
apiRouter.post(
  "/enrollLead",
  validateEnrollLead,
  uploadTransactionProof.single("transactionProof"),
  enrollLeadController
);

export default apiRouter;