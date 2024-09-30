import express from "express";
import {
  addNewLeadsController,
  counsellorAuthenticateJWT,
  getAllLeadsController,
  getLeadByIdController,
  counsellorManageLeadStatusController,
  consellorRegisterLeadAsUserController,
  counsellorAddTransactionDetailsController,
} from "../controller/counsellorController";
import { uploadTransactionProof } from "../utilities/multer";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

/**
 * @swagger
 * /counsellor/counsellorManageLeadStatus:
 *   post:
 *     summary: Manage the status of a lead
 *     tags: [Counsellor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Lead status update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leadId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *       400:
 *         description: Bad request or missing parameters
 */
counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);

/**
 * @swagger
 * /counsellor/counsellorEnrollStudent:
 *   post:
 *     summary: Enroll a lead as a student and add transaction details
 *     tags: [Counsellor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Transaction details along with proof file
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               leadId:
 *                 type: string
 *               transactionProof:
 *                 type: string
 *                 format: binary
 *               transactionAmount:
 *                 type: string
 *               transactionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Student enrolled and transaction details added successfully
 *       400:
 *         description: Invalid data or transaction proof missing
 */
counsellorRouter.post("/counsellorEnrollStudent", uploadTransactionProof.single('transactionProof'), consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);

/**
 * @swagger
 * /counsellor/addNewLeads:
 *   post:
 *     summary: Add a new lead
 *     tags: [Counsellor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Lead information to add
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
 *               phone:
 *                 type: string
 *               courseInterested:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead added successfully
 *       400:
 *         description: Bad request or missing parameters
 */
counsellorRouter.post("/addNewLeads", addNewLeadsController);

/**
 * @swagger
 * /counsellor/getAllLeads:
 *   get:
 *     summary: Retrieve all leads
 *     tags: [Counsellor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   leadId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   courseInterested:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.get("/getAllLeads", getAllLeadsController);

/**
 * @swagger
 * /counsellor/getLeadById/{leadId}:
 *   get:
 *     summary: Retrieve lead information by ID
 *     tags: [Counsellor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         schema:
 *           type: string
 *         required: true
 *         description: The lead's unique ID
 *     responses:
 *       200:
 *         description: Lead information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leadId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 courseInterested:
 *                   type: string
 *       404:
 *         description: Lead not found
 */
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);

export default counsellorRouter;