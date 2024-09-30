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
import multer from "multer";
import { uploadTransactionProof } from "../utilities/multer";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/counsellorEnrollStudent", uploadTransactionProof.single('transactionProof'), consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);


counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/addNewLeads", addNewLeadsController);
counsellorRouter.get("/getAllLeads", getAllLeadsController);
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);

export default counsellorRouter;
