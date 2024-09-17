import express from "express";
import {
  adminAddContactNumberController,
  adminAuthenticateJWT,
  adminAuthenticationController,
  adminRaiseQueryController,
  adminResponseController,
  adminViewProfileController,
  adminViewRaisedQueryListController,
} from "../controller/adminController";

const adminRouter = express.Router();

adminRouter.get("/", (request: express.Request, response: express.Response) => {
  try {
    console.log("Hello from admin Router ..!");
  } catch (error) {
    console.log("Error in /admin/ ..!");
  }
});

// adminRouter.post("/adminLogin", adminLoginController);
adminRouter.get("/adminAuthentication", adminAuthenticationController);

adminRouter.use(adminAuthenticateJWT);
adminRouter.get("/adminViewProfile", adminViewProfileController);
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);
adminRouter.get("/adminViewRaisedQueries", adminViewRaisedQueryListController);
adminRouter.post("/adminRaiseQuery", adminRaiseQueryController);
adminRouter.post(
  "/adminAddResponseToQuery/:queryId/conversation",
  adminResponseController
);

export default adminRouter;
