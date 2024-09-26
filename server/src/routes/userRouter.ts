import express, { Request } from "express";
import {
  userAddCommentController,
  userAddContactNumberController,
  userAuthenticateJWT,
  userAuthenticationController,
  userGetQueryDataController,
  userManageQueryStatusController,
  userRaiseQueryController,
  userViewMyQueriesController,
  ,userViewProfileController
} from "../controller/userController";
import { loginController } from "../controller/LoginController";

interface CustomRequest extends Request {
  payload: {
    email: string;
    roleName: string;
    access: [string];
    token: string;
  };
}

const userRouter = express.Router();
// userRouter.get('/', (request: express.Request, response: express.Response) => {
//     console.log('Welcome user ..!');
//     response.status(201).json({ msg: 'Hi, server has been connected successfully ..!' })
// });

userRouter.post("/userLogin", loginController);
userRouter.get("/userAuthentication", userAuthenticationController);

userRouter.use(userAuthenticateJWT);
userRouter.get("/userViewProfile", userViewProfileController);
userRouter.post('/userRaiseQuery', userRaiseQueryController);

userRouter.get("/userViewMyQueries", userViewMyQueriesController);
userRouter.get("/userGetQueryData/:queryId", userGetQueryDataController);

userRouter.post('/userAddContactNumber', userAddContactNumberController)

userRouter.post(
  "/userManageQueryStatus/:queryId/:status",
  userManageQueryStatusController
);
userRouter.post("/userAddCommentToQuery/:queryId", userAddCommentController);

export default userRouter;
