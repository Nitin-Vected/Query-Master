"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const adminRouter = express_1.default.Router();
adminRouter.get('/', (request, response) => {
    try {
        console.log('Hello from admin Router ..!');
    }
    catch (error) {
        console.log('Error in /admin/ ..!');
    }
});
// adminRouter.post("/adminLogin", adminLoginController);
adminRouter.get("/adminAuthentication", adminController_1.adminAuthenticationController);
adminRouter.use(adminController_1.adminAuthenticateJWT);
adminRouter.get("/adminViewProfile", adminController_1.adminViewProfileController);
adminRouter.post("/adminAddContactNumber", adminController_1.adminAddContactNumberController);
adminRouter.get("/adminViewRaisedQueries", adminController_1.adminViewRaisedQueryListController);
adminRouter.post('/adminRaiseQuery', adminController_1.adminRaiseQueryController);
adminRouter.post('/adminAddResponseToQuery/:queryId/conversation', adminController_1.adminResponseController);
exports.default = adminRouter;
