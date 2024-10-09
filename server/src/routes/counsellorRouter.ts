import express from "express";
import {
  counsellorAddNewLeadController,
  counsellorAuthenticateJWT,
  counsellorGetAllLeadsController,
  counsellorGetLeadByIdController,
  counsellorUpdateLeadController,
  counsellorEnrollLeadController,
} from "../controller/counsellorController";
import { uploadTransactionProof } from "../utilities/multer";
import { counsellorValidateAddNewLeads, counsellorValidateGetLeadById, counsellorValidateManageLeadStatus, counsellorValidateRegisterLeadAsUser } from "../utilities/validation/counsellorValidation";
import { viewProfileController } from "../controller/commonController";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

/**
 * @swagger
 * /counsellor/profile:
 *   get:
 *     summary: View Counsellor Profile
 *     tags: [Counsellor]
 *     responses:
 *       200:
 *         description: Successful operation
 */
counsellorRouter.get("/profile", viewProfileController);

/**
 * @swagger
 * /counsellor/lead:
 *   put:
 *     summary: update a lead
 *     tags: [Counsellor]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lead
 *     requestBody:
 *       description: Lead status update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the lead
 *               lastName:
 *                 type: string
 *                 description: Last name of the lead
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the lead
 *               leadEmail:
 *                 type: string
 *                 description: Email address of the lead
 *               productAmount:
 *                 type: number
 *                 description: The fees amount associated with the lead
 *               discount:
 *                 type: number
 *                 description: Discount on the fees
 *               statusId:
 *                 type: string
 *                 description: Status ID of the lead
 *               productId:
 *                 type: string
 *                 description: Product ID of the lead 
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *                 description: Counsellor of the lead 
 *               comment:
 *                 type: string
 *                 description: Counsellor of the lead 
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.put(
  "/lead", counsellorValidateManageLeadStatus,
  counsellorUpdateLeadController
);

/**
 * @swagger
 * /counsellor/enrollLead:
 *   post:
 *     summary: Enroll a lead as a student and add transaction details
 *     tags: [Counsellor]
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
 *               productId:
 *                 type: string
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
counsellorRouter.post(
  "/enrollLead",
  uploadTransactionProof.single("transactionProof"),
  counsellorEnrollLeadController
);

/**
 * @swagger
 * /counsellor/lead:
 *   post:
 *     summary: Add a new lead
 *     tags: [Counsellor]
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
 *               lastName:
 *                 type: string
 *                 description: Last name of the lead
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the lead
 *               leadEmail:
 *                 type: string
 *                 description: Email address of the lead
 *               productAmount:
 *                 type: number
 *                 description: The fees amount associated with the lead
 *               discount:
 *                 type: number
 *                 description: Discount on the fees
 *               channelId:
 *                 type: string
 *                 description: The channel through which the lead was acquired
 *               statusId:
 *                 type: string
 *                 description: Status ID of the lead
 *               productId:
 *                 type: string
 *                 description: Product ID of the lead 
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *                 description: Counsellor of the lead 
 *               comment:
 *                 type: string
 *                 description: Counsellor of the lead  *                 
 *     responses:
 *       201:
 *         description: Lead added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.post("/lead", counsellorAddNewLeadController);

/**
 * @swagger
 * /counsellor/lead:
 *   get:
 *     summary: Retrieve all leads
 *     tags: [Counsellor]
 *     responses:
 *       200:
 *         description: List of all leads
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.get("/lead", counsellorGetAllLeadsController);

/**
 * @swagger
 * /counsellor/lead/{leadId}:
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.get("/lead/:leadId", counsellorValidateGetLeadById, counsellorGetLeadByIdController);

export default counsellorRouter;
