import express from "express";
import {
  addNewLeadsController,
  counsellorAuthenticateJWT,
  getAllLeadsController,
  getLeadByIdController,
  updateCourseApplicationStatusController,
  createUserAndStudentController,
} from "../controller/counsellorController";

const counsellorRouter = express.Router();

counsellorRouter.use(counsellorAuthenticateJWT);

counsellorRouter.post("/addNewLeads", addNewLeadsController);
counsellorRouter.get("/getAllLeads", getAllLeadsController);
counsellorRouter.get("/getLeadById/:leadId", getLeadByIdController);
counsellorRouter.put(
  "//leads/course-application/status",
  updateCourseApplicationStatusController
);
counsellorRouter.post("/createUserAndStudent", createUserAndStudentController);

export default counsellorRouter;
