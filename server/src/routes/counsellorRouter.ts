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
 *               firstName:
 *                 type: string
 *                 description: First name of the lead
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the lead
 *                 example: "Doe"
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the lead
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 description: Email address of the lead
 *                 example: "john.doe@example.com"
 *               feesAmount:
 *                 type: number
 *                 description: The fees amount associated with the lead
 *                 example: 5000
 *               discount:
 *                 type: number
 *                 description: Discount on the fees
 *                 example: 10
 *                 minimum: 0
 *                 maximum: 15
 *               channel:
 *                 type: string
 *                 description: The channel through which the lead was acquired
 *                 example: "Referral"
 *               statusId:
 *                 type: string
 *                 description: Status ID of the lead
 *                 example: "STATUSHqMSvRUC303"
 *               courses:
 *                 type: array
 *                 description: List of courses
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: string
 *                       description: The ID of the course
 *                       example: "COURSE8Loyl3ELJ01"
 *                     appliedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the course was applied for
 *                       example: "2024-01-01T00:00:00.000Z"
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
 *     summary: Get Lead by ID
 *     tags: [Counsellor]
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
 */
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);

export default counsellorRouter;