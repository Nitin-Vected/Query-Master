import express from "express";
import {
  addNewLeadsController,
  councilorAuthenticateJWT,
  getAllLeadsController,
  getLeadByIdController,
  updateCourseApplicationStatusController,
  createUserAndStudentController,
} from "../controller/councilorController";

const councilorRouter = express.Router();

councilorRouter.use(councilorAuthenticateJWT);

councilorRouter.post("/addNewLeads", addNewLeadsController);
councilorRouter.get("/getAllLeads", getAllLeadsController);
councilorRouter.get("/getLeadById/:leadId", getLeadByIdController);
councilorRouter.put(
  "//leads/course-application/status",
  updateCourseApplicationStatusController
);
councilorRouter.post("/createUserAndStudent", createUserAndStudentController);

export default councilorRouter;
