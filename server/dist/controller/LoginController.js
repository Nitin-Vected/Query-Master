"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginController = exports.loginController = void 0;
const axios_1 = __importDefault(require("axios"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jwt_1 = require("../utilities/jwt");
const config_1 = require("../config");
const verifyGoogleToken = (tokenResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
            },
        });
        console.log("result.data : ", result);
        if (result.data) {
            console.log("result.data : ", result.data);
            return result.data;
        }
        return null;
    }
    catch (error) {
        console.log(error);
    }
});
const loginController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenResponse } = request.body;
        // console.log("tokenResponse token : ", tokenResponse);
        const decodedToken = yield verifyGoogleToken(tokenResponse);
        console.log("Decoded Token : ", decodedToken);
        if (decodedToken) {
            const { name, given_name, family_name, picture, email, email_verified } = decodedToken;
            let userData = yield userModel_1.default.findOne({ email: email });
            console.log("userData : ", userData);
            if (userData) {
                userData.email = email;
                userData.name = name;
                userData.profileImg = picture;
                userData.firstName = given_name;
                userData.lastName = family_name;
                userData.status = email_verified;
                yield userData.save();
                console.log("User Data Updated");
                const payload = {
                    name,
                    email,
                    role: userData.role,
                    status: userData.status,
                };
                if (userData.role === "Student") {
                    const token = (0, jwt_1.tokenGenerator)(payload, config_1.USER_SECRET_KEY);
                    response.status(201).json({
                        userData: userData,
                        token: token,
                        message: "Logged in  Successfull ..!",
                    });
                }
                else {
                    console.log("UserData checking : ", userData);
                    const token = (0, jwt_1.tokenGenerator)(payload, config_1.ADMIN_SECRET_KEY);
                    response.status(201).json({
                        userData: userData,
                        token: token,
                        message: "Logged in  Successfull ..!",
                    });
                }
            }
            else {
                // throw new Error('Account Not Exist ..!');
                userData = yield userModel_1.default.create({
                    name: name,
                    firstName: given_name,
                    lastName: family_name,
                    email: email,
                    profileImg: picture,
                    role: "SupportAdmin",
                    status: email_verified,
                });
                console.log("user has been registered successfully ..!", userData);
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Account Not Exist ..!" });
    }
});
exports.loginController = loginController;
const adminLoginController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenResponse } = request.body;
        console.log("token : ", tokenResponse);
        const decodedToken = yield verifyGoogleToken(tokenResponse);
        console.log("Decoded Token : ", decodedToken);
        if (decodedToken) {
            const { name, given_name, family_name, picture, email, email_verified } = decodedToken;
            let adminData = yield userModel_1.default.findOne({ email: email });
            console.log("adminData : ", adminData);
            if (adminData) {
                adminData.email = email;
                adminData.name = name;
                adminData.profileImg = picture;
                adminData.firstName = given_name;
                adminData.lastName = family_name;
                adminData.status = email_verified;
                yield adminData.save();
                console.log("User Data Updated");
                const payload = {
                    name,
                    email,
                    role: adminData.role,
                    status: adminData.status,
                };
                const token = (0, jwt_1.tokenGenerator)(payload, config_1.ADMIN_SECRET_KEY);
                console.log("Admin Token inside adminController ==> ", token);
                response.status(201).json({
                    userData: adminData,
                    token: token,
                    message: "Logged in  Successfull ..!",
                });
            }
            else {
                response.status(500).json({ message: "Wrong Admin Credentials  ..!" });
                // adminData = await userModel.create({
                //     name: name,
                //     firstName: given_name,
                //     lastName: family_name,
                //     email: email,
                //     profileImg: picture,
                //     role: 'SupportAdmin',
                //     status: email_verified,
                // });
                // console.log('user has been registered successfully ..!', adminData);
                // const payload = {
                //     name,
                //     email,
                //     role: adminData.role,
                //     status: adminData.status,
                // }
                // const token = tokenGenerator(payload, ADMIN_SECRET_KEY);
                // response.status(201).json({ userData: adminData, token: token, message: "SupportAdmin has been Registered Successfully ..!" });
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Account Not Exist ..!" });
    }
});
exports.adminLoginController = adminLoginController;
