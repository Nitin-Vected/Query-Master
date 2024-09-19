import express from "express";
import {
  adminAddContactNumberController,
  adminAuthenticateJWT,
  adminAuthenticationController,
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

// adminRouter.get("/", (request: express.Request, response: express.Response) => {
//   try {
//     console.log("Hello from admin Router ..!");
//   } catch (error) {
//     console.log("Error in /admin/ ..!");
//   }
// });

// adminRouter.post("/adminLogin", adminLoginController);
adminRouter.get("/adminAuthentication", adminAuthenticationController);

adminRouter.use(adminAuthenticateJWT);

adminRouter.get("/adminViewProfile", adminViewProfileController);
adminRouter.get("/adminViewStudentList", adminViewStudentListController);
adminRouter.get("/adminViewRaisedQueries", adminViewRaisedQueryListController);
adminRouter.get('/adminGetQueryData/:queryId',adminGetQueryDataController);

adminRouter.get("/adminViewSupportAdminList", adminViewSupportAdminListController);
adminRouter.get("/adminViewUserList", adminViewUserListController);

adminRouter.post('/adminManageQueryStatus/:queryId/:status',adminManageQueryStatusController);
adminRouter.get('/adminManageStudentStatus/:studentId/:action',adminManageStudentStatusController);

adminRouter.post("/adminRaiseQuery", adminRaiseQueryController);
adminRouter.post("/adminAddResponseToQuery/:queryId",adminResponseController);
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);

export default adminRouter;
