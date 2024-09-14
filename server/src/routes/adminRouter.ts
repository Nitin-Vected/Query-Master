import express from 'express';
import { adminAddContactNumberController, adminAddResponseToParticularQueryController, adminAuthenticateJWT, adminLoginController, adminViewProfileController } from '../controller/adminController';

const adminRouter = express.Router();

adminRouter.get('/', (request: express.Request, response: express.Response) => {
    try {
        console.log('Hello from admin Router ..!');
    } catch (error) {
        console.log('Error in /admin/ ..!')
    }
})

adminRouter.post("/adminLogin", adminLoginController);
adminRouter.get("/adminViewProfile", adminViewProfileController);

adminRouter.use(adminAuthenticateJWT);
adminRouter.post("/adminAddContactNumber", adminAddContactNumberController);
adminRouter.post("/adminAddResponseToQuery", adminAddResponseToParticularQueryController);




export default adminRouter;