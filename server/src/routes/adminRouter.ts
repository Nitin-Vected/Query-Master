// src/routes/adminRouter.ts
import express from "express";
import {
  adminAddNewProductController,
  adminAddNewRoleController,
  adminAddNewStatusController,
  adminAuthenticateJWT,
  adminGetAllProductController,
  adminGetAllRolesController,
  adminViewStudentListController,
  adminViewConsellorListController,
  adminViewUserListController,
  adminGetProductByIdController,
  adminGetRoleByIdController,
  adminAddNewChannelController,
  adminGetAllChannelsController,
  adminGetAllStatusController,
  adminUpdateProductByIdController,
  adminGetStatusByIdController,
  adminGetChannelByIdController,
  adminUpdateChannelController,
  adminUpdateStatusController,
  adminUpdateRoleController,
} from "../controller/adminController";
import {
  adminValidateNewRole,
  adminValidateRoleId,
  adminValidateUpdateRole,
  adminValidateNewStatus,
  adminValidateStatusId,
  adminValidateUpdateStatus,
  adminValidateNewChannel,
  adminValidateChannelId,
  adminValidateUpdateChannel,
  adminValidateNewProduct,
  adminValidateProductId,
  adminValidateUpdateProduct,
} from "../utilities/validation/adminValidation";

const adminRouter = express.Router();

adminRouter.use(adminAuthenticateJWT);

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

/**
 * @swagger
 * /admin/consellor:
 *   get:
 *     summary: View List of Counsellor
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful operation
 */
adminRouter.get("/consellor", adminViewConsellorListController);

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
adminRouter.get(
  "/role/:roleId",
  adminValidateRoleId,
  adminGetRoleByIdController
);

/**
 * @swagger
 * /admin/role/{roleId}:
 *   put:
 *     summary: Update Role
 *     tags: [Admin]
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
adminRouter.put(
  "/role/:roleId",
  adminValidateUpdateRole,
  adminUpdateRoleController
);

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
adminRouter.post("/status", adminValidateNewStatus, adminAddNewStatusController);

/**
 * @swagger
 * /admin/status:
 *   get:
 *     summary: Get All Status
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all Status
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/status", adminGetAllStatusController);

/**
 * @swagger
 * /admin/status/{statusId}:
 *   get:
 *     summary: Get Status by ID
 *     tags: [Admin]
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
adminRouter.get(
  "/status/:statusId",
  adminValidateStatusId,
  adminGetStatusByIdController
);

/**
 * @swagger
 * /admin/status/{statusId}:
 *   put:
 *     summary: Update Status
 *     tags: [Admin]
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
adminRouter.put(
  "/status/:statusId",
  adminValidateUpdateStatus,
  adminUpdateStatusController
);

/**
 * @swagger
 * /admin/channel:
 *   post:
 *     summary: Add New Channel
 *     tags: [Admin]
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
adminRouter.post(
  "/channel",
  adminValidateNewChannel,
  adminAddNewChannelController
);

/**
 * @swagger
 * /admin/channel:
 *   get:
 *     summary: Get All Channel
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all Channel
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
adminRouter.get("/channel", adminGetAllChannelsController);

/**
 * @swagger
 * /admin/channel/{channelId}:
 *   get:
 *     summary: Get Channel by ID
 *     tags: [Admin]
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
adminRouter.get(
  "/channel/:channelId",
  adminValidateChannelId,
  adminGetChannelByIdController
);

/**
 * @swagger
 * /admin/channel/{channelId}:
 *   put:
 *     summary: Update Channel
 *     tags: [Admin]
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
adminRouter.put(
  "/channel/:channelId",
  adminValidateUpdateChannel,
  adminUpdateChannelController
);

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
adminRouter.post(
  "/product",
  adminValidateNewProduct,
  adminAddNewProductController
);

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
adminRouter.get(
  "/product/:productId",
  adminValidateProductId,
  adminGetProductByIdController
);

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
adminRouter.put(
  "/product/:productId",
  adminValidateUpdateProduct,
  adminUpdateProductByIdController
);

export default adminRouter;
