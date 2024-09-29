import express from "express";
import {
  addNewLeadsController,
  counsellorAuthenticateJWT,
  getAllLeadsController,
  getLeadByIdController,
  updateCourseCategoryStatusController,
  createUserAndStudentController,
  counsellorViewProfileController,
  counsellorManageLeadStatusController,
  consellorRegisterLeadAsUserController,
  counsellorAddTransactionDetailsController,
  addNewOrderController,
} from "../controller/counsellorController";
import multer from "multer";
import { uploadTransactionProof } from "../utilities/multer";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/counsellorEnrollStudent", uploadTransactionProof.single('transactionProof'), consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);


counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/counsellorEnrollStudent", consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);

counsellorRouter.post("/addNewOrder", addNewOrderController)

counsellorRouter.get("/counsellorViewProfile", counsellorViewProfileController);
counsellorRouter.post("/addNewLeads", addNewLeadsController);
counsellorRouter.get("/getAllLeads", getAllLeadsController);
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);
counsellorRouter.put("/leads/course-application/status", updateCourseCategoryStatusController);
counsellorRouter.post("/createUserAndStudent", createUserAndStudentController);

export default counsellorRouter;
