import express from 'express';
import { userAddCommentController, userAddContactNumberController, userAuthenticateJWT, userAuthenticationController, userGetQueriesController, userRaiseQueryController, userViewMyQueriesController, userViewProfileController } from '../controller/userController';
import { loginController } from '../controller/LoginController';
const userRouter = express.Router();
userRouter.get('/', (request: express.Request, response: express.Response) => {
    console.log('Welcome user ..!');
    response.status(201).json({ msg: 'Hi, server has been connected successfully ..!' })
});


userRouter.post("/userLogin", loginController);
userRouter.get("/userAuthentication", userAuthenticationController);

userRouter.use(userAuthenticateJWT);
userRouter.get("/userViewProfile", userViewProfileController);
userRouter.get("/userViewMyQueries", userViewMyQueriesController);
userRouter.post('/userAddContactNumber', userAddContactNumberController)
userRouter.post('/userRaiseQuery',userRaiseQueryController);

userRouter.post("/userAddCommentToQuery/:queryId",userAddCommentController);

// userRouter.get("/userCloseQuery", userCloseQueryController);

userRouter.get("/userGetQueriesInRange", userGetQueriesController)

export default userRouter;