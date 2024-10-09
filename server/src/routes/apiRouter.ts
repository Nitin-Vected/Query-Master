// src/routes/userRouter.ts
import express, { Request } from "express";
import { loginController } from "../controller/loginController";
import {
  authenticateJWT,
  authenticationController,
  viewProfileController,
} from "../controller/commonController";
import { validateNewRole, validateRoleId, validateUpdateRole } from "../utilities/validation/roleValidation";
import { addNewRoleController, getAllRolesController, getRoleByIdController, updateRoleController,  } from "../controller/roleController";
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
apiRouter.get(
  "/role/:roleId",
  validateRoleId,
  getRoleByIdController
);

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
apiRouter.put(
  "/role/:roleId",
  validateUpdateRole,
  updateRoleController
);

export default apiRouter;
