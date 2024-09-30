// src/routes/userRouter.ts
import express, { Request } from "express";
import {
  userAddCommentController,
  userAddContactNumberController,
  userAuthenticateJWT,
  userAuthenticationController,
  userGetQueryDataController,
  userManageQueryStatusController,
  userRaiseQueryController,
  userViewMyQueriesController,
  userViewProfileController,
} from "../controller/userController";
import { loginController } from "../controller/loginController";

const userRouter = express.Router();


/**
 * @swagger
 * /user/userLogin:
 *   post:
 *     summary: User Login
 *     tags: [User]
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
*/
userRouter.post("/userLogin", loginController);


/**
 * @swagger
 * /user/userAuthentication:
 *   get:
 *     summary: User Authentication
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Unauthorized
*/
userRouter.get("/userAuthentication", userAuthenticationController);

userRouter.use(userAuthenticateJWT);

/**
 * @swagger
 * /user/userViewProfile:
 *   get:
 *     summary: View User Profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
userRouter.get("/userViewProfile", userViewProfileController);

/**
 * @swagger
 * /user/userRaiseQuery:
 *   post:
 *     summary: Raise a Query
 *     tags: [User]
 *     requestBody:
 *       description: Query details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Query raised
 */
userRouter.post("/userRaiseQuery", userRaiseQueryController);

/**
 * @swagger
 * /user/userViewMyQueries:
 *   get:
 *     summary: View My Queries
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of user queries
 */
userRouter.get("/userViewMyQueries", userViewMyQueriesController);

/**
 * @swagger
 * /user/userGetQueryData/{queryId}:
 *   get:
 *     summary: Get Query Data by ID
 *     tags: [User]
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
userRouter.get("/userGetQueryData/:queryId", userGetQueryDataController);

/**
 * @swagger
 * /user/userAddContactNumber:
 *   post:
 *     summary: Add Contact Number
 *     tags: [User]
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
userRouter.post("/userAddContactNumber", userAddContactNumberController);

/**
 * @swagger
 * /user/userManageQueryStatus/{queryId}/{status}:
 *   post:
 *     summary: Manage Query Status
 *     tags: [User]
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
userRouter.post(
  "/userManageQueryStatus/:queryId/:status",
  userManageQueryStatusController
);

/**
 * @swagger
 * /user/userAddCommentToQuery/{queryId}:
 *   post:
 *     summary: Add Comment to Query
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the query
 *     requestBody:
 *       description: Comment to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added
 */
userRouter.post("/userAddCommentToQuery/:queryId", userAddCommentController);

export default userRouter;
