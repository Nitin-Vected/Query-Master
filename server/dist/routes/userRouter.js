"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const LoginController_1 = require("../controller/LoginController");
const userRouter = express_1.default.Router();
userRouter.get('/', (request, response) => {
    console.log('Welcome user ..!');
    response.status(201).json({ msg: 'Hi, server has been connected successfully ..!' });
});
userRouter.post("/userLogin", LoginController_1.loginController);
userRouter.get("/userAuthentication", userController_1.userAuthenticationController);
userRouter.use(userController_1.userAuthenticateJWT);
userRouter.get("/userViewProfile", userController_1.userViewProfileController);
userRouter.get("/userViewMyQueries", userController_1.userViewMyQueriesController);
userRouter.post('/userAddContactNumber', userController_1.userAddContactNumberController);
userRouter.post('/userRaiseQuery', userController_1.userRaiseQueryController);
userRouter.get("/userGetQueriesInRange", userController_1.userGetQueriesController);
exports.default = userRouter;
