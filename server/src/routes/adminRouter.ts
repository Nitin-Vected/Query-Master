import express from "express";
import {
  adminAddContactNumberController,
  adminAddNewRoleController,
  adminAuthenticateJWT,
  adminGetQueryDataController,
  adminManageQueryStatusController,
  adminManageStudentStatusController,
  adminRaiseQueryController,
  adminResponseController,
  adminViewProfileController,
  adminViewRaisedQueryListController,
  adminViewStudentListController,
  adminViewSupportAdminListController,
  adminViewUserListController,
} from "../controller/adminController";

const adminRouter = express.Router();

adminRouter.use(adminAuthenticateJWT);

adminRouter.get("/adminViewProfile", adminViewProfileController);
adminRouter.get("/adminViewStudentList", adminViewStudentListController);
adminRouter.get("/adminViewRaisedQueries", adminViewRaisedQueryListController);
adminRouter.get("/adminGetQueryData/:queryId", adminGetQueryDataController);

adminRouter.get(
  "/adminViewSupportAdminList",
  adminViewSupportAdminListController
);
adminRouter.get("/adminViewUserList", adminViewUserListController);

adminRouter.post(
  "/adminManageQueryStatus/:queryId/:status",
  adminManageQueryStatusController
);
adminRouter.get(
  "/adminManageStudentStatus/:email/:action",
  adminManageStudentStatusController
);

adminRouter.post("/adminRaiseQuery", adminRaiseQueryController);
adminRouter.post("/adminAddResponseToQuery/:queryId", adminResponseController);
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);

adminRouter.post("/addNewRole", adminAddNewRoleController);

export default adminRouter;
