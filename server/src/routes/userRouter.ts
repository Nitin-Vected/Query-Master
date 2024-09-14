import express from 'express';
import { userAddContactNumberController, userAuthenticateJWT, userLoginController, userRaiseQueryController, userViewProfileController } from '../controller/userController';
const userRouter = express.Router();
userRouter.get('/', (request: express.Request, response: express.Response) => {
    console.log('Welcome user ..!');
    response.status(201).json({ msg: 'Hi, server has been connected successfully ..!' })
});


userRouter.post("/userLogin", userLoginController);
userRouter.get("/userViewProfile", userViewProfileController);

userRouter.use(userAuthenticateJWT);
userRouter.post('/userAddContactNumber', userAddContactNumberController)
userRouter.post('/userRaiseQuery',userRaiseQueryController);






export default userRouter;