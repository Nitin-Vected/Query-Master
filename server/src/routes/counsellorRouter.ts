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
import {
  counsellorValidateAddNewLeads,
  counsellorValidateGetLeadById,
  counsellorValidateUpdateLead,
  counsellorValidateRegisterLeadAsUser,
} from "../utilities/validation/counsellorValidation";
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
counsellorRouter.get(
  "/lead/:leadId",
  counsellorValidateGetLeadById,
  counsellorGetLeadByIdController
);

/**
 * @swagger
 * /counsellor/lead/{leadId}:
 *   put:
 *     summary: Update a lead
 *     tags: [Counsellor]
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
counsellorRouter.put(
  "/lead/:leadId",
  counsellorValidateUpdateLead,
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
counsellorRouter.post(
  "/enrollLead",
  uploadTransactionProof.single("transactionProof"),
  counsellorEnrollLeadController
);

export default counsellorRouter;
