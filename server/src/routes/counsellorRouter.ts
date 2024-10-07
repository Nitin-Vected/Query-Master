import express from "express";
import {
  // counsellorAddNewLeadsController,
  counsellorAuthenticateJWT,
  counsellorGetAllLeadsController,
  counsellorGetLeadByIdController,
  counsellorManageLeadStatusController,
  counsellorRegisterLeadAsUserController,
  counsellorViewProfileController,
} from "../controller/counsellorController";
import { uploadTransactionProof } from "../utilities/multer";
import { counsellorValidateAddNewLeads, counsellorValidateGetLeadById, counsellorValidateManageLeadStatus, counsellorValidateRegisterLeadAsUser } from "../utilities/validation/counsellorValidation";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

/**
 * @swagger
 * /counsellor/counsellorViewProfile:
 *   get:
 *     summary: View Counsellor Profile
 *     tags: [Counsellor]
 *     responses:
 *       200:
 *         description: Successful operation
 */
counsellorRouter.get("/counsellorViewProfile", counsellorViewProfileController);

/**
 * @swagger
 * /counsellor/counsellorManageLeadStatus:
 *   post:
 *     summary: Manage the status of a lead
 *     tags: [Counsellor]
 *     requestBody:
 *       description: Lead status update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@gmail.com"
 *               statusId:
 *                 type: string
 *                 example: "STATUSD4fuSAZ_m02"
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *       400:
 *         description: Bad request or missing parameters
 */
counsellorRouter.post(
  "/counsellorManageLeadStatus", counsellorValidateManageLeadStatus,
  counsellorManageLeadStatusController
);

/**
 * @swagger
 * /counsellor/counsellorEnrollStudent:
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
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               coursesPurchased:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentMode:
 *                 type: string
 *               paymentType:
 *                 type: string
 *               finalAmount:
 *                 type: string
 *               discount:
 *                 type: number
 *               statusId:
 *                 type: string
 *               transactionProof:
 *                 type: string
 *                 format: binary
 *               transactionAmount:
 *                 type: number
 *                 example: 5000
 *               transactionDate:
 *                 type: string
 *                 format: date
 *               emiDetails:
 *                 type: object
 *                 properties:
 *                   emiCount:
 *                     type: integer
 *                     example: 12
 *                   installments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         dueDate:
 *                           type: string
 *                           format: date
 *                           example: "2024-10-01"
 *                         transactionAmount:
 *                           type: string
 *                           format: date
 *                           example: "2024-10-01"
 *                         status:
 *                           type: string
 *                           enum: [paid, pending, overdue]
 *                           example: "pending"
 *     responses:
 *       200:
 *         description: Student enrolled and transaction details added successfully
 *       400:
 *         description: Invalid data or transaction proof missing
 */
counsellorRouter.post("/counsellorEnrollStudent", counsellorValidateRegisterLeadAsUser, uploadTransactionProof.single('transactionProof'), counsellorRegisterLeadAsUserController);

// /**
//  * @swagger
//  * /counsellor/counsellorAddNewLead:
//  *   post:
//  *     summary: Add a new lead
//  *     tags: [Counsellor]
//  *     requestBody:
//  *       description: Lead information to add
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *                 description: First name of the lead
//  *                 example: "John"
//  *               lastName:
//  *                 type: string
//  *                 description: Last name of the lead
//  *                 example: "Doe"
//  *               contactNumber:
//  *                 type: string
//  *                 description: Contact number of the lead
//  *                 example: "1234567890"
//  *               email:
//  *                 type: string
//  *                 description: Email address of the lead
//  *                 example: "john.doe@example.com"
//  *               finalAmount:
//  *                 type: number
//  *                 description: The fees amount associated with the lead
//  *                 example: 5000
//  *               discount:
//  *                 type: number
//  *                 description: Discount on the fees
//  *                 example: 10
//  *               channel:
//  *                 type: string
//  *                 description: The channel through which the lead was acquired
//  *                 example: "Referral"
//  *               statusId:
//  *                 type: string
//  *                 description: Status ID of the lead
//  *                 example: "STATUSEe-_oqeWU01"
//  *               courses:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 
//  *     responses:
//  *       201:
//  *         description: Lead added successfully
//  *       400:
//  *         description: Bad request or missing parameters
//  */
// counsellorRouter.post("/counsellorAddNewLead", counsellorValidateAddNewLeads, counsellorAddNewLeadsController);

/**
 * @swagger
 * /counsellor/counsellorGetAllLeads:
 *   get:
 *     summary: Retrieve all leads
 *     tags: [Counsellor]
 *     responses:
 *       200:
 *         description: List of all leads
 *       401:
 *         description: Unauthorized
 */
counsellorRouter.get("/counsellorGetAllLeads", counsellorGetAllLeadsController);

/**
 * @swagger
 * /counsellor/counsellorGetLeadById/{leadId}:
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
counsellorRouter.get("/counsellorGetLeadById/:leadId", counsellorValidateGetLeadById, counsellorGetLeadByIdController);

export default counsellorRouter;
