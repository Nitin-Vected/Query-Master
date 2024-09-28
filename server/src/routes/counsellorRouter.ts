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
} from "../controller/counsellorController";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/counsellorEnrollStudent", consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);


counsellorRouter.post("/counsellorManageLeadStatus", counsellorManageLeadStatusController);
counsellorRouter.post("/counsellorEnrollStudent", consellorRegisterLeadAsUserController, counsellorAddTransactionDetailsController);


counsellorRouter.get("/counsellorViewProfile", counsellorViewProfileController);
counsellorRouter.post("/addNewLeads", addNewLeadsController);
counsellorRouter.get("/getAllLeads", getAllLeadsController);
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);
counsellorRouter.put("/leads/course-application/status", updateCourseCategoryStatusController);
counsellorRouter.post("/createUserAndStudent", createUserAndStudentController);

export default counsellorRouter;
