// src/routes/userRouter.ts
import express, { Request } from "express";
import {
  userAddContactNumberController,
  userAuthenticateJWT,
  userAuthenticationController,
  userViewProfileController,
} from "../controller/userController";
import { loginController } from "../controller/loginController";
import { viewProfileController } from "../controller/commonController";
const userRouter = express.Router();

// /**
//  * @swagger
//  * /user/login:
//  *   post:
//  *     summary: User Login
//  *     tags: [User]
//  *     requestBody:
//  *       description: Login credentials
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *     security: []
//  */
// userRouter.post("/login", loginController);
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
 * /user/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User profile not found
 */
userRouter.get("/profile", viewProfileController);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.put("/profile", userAddContactNumberController);

// /**
//  * @swagger
//  * /user/userAuthentication:
//  *   get:
//  *     summary: User Authentication
//  *     tags: [User]
//  *     responses:
//  *       200:
//  *         description: Authentication successful
//  *       401:
//  *         description: Unauthorized
//  */
// userRouter.get("/userAuthentication", userAuthenticationController);

// userRouter.use(userAuthenticateJWT);

// /**
//  * @swagger
//  * /user/userViewProfile:
//  *   get:
//  *     summary: View User Profile
//  *     tags: [User]
//  *     responses:
//  *       200:
//  *         description: User profile retrieved
//  */
// userRouter.get("/userViewProfile", userViewProfileController);

// /**
//  * @swagger
//  * /user/userAddContactNumber:
//  *   post:
//  *     summary: Add Contact Number
//  *     tags: [User]
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
// userRouter.post("/userAddContactNumber", userAddContactNumberController);



export default userRouter;
