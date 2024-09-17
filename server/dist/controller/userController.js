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
exports.userAuthenticateJWT = exports.userAuthenticationController = exports.userViewMyQueriesController = exports.userGetQueriesController = exports.userRaiseQueryController = exports.userAddContactNumberController = exports.userViewProfileController = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const jwt_1 = require("../utilities/jwt");
const config_1 = require("../config");
const queryModel_1 = __importDefault(require("../model/queryModel"));
;
const userViewProfileController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = request.payload.email;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        }
        else {
            const userData = yield userModel_1.default.findOne({ email });
            if (userData === null || userData === void 0 ? void 0 : userData.status) {
                response.status(201).json({ userData: userData, message: "This is your dersired data ..!" });
            }
            else {
                response.status(404).json({ userData: null, message: "The Account You are Trying to Acces has been Deactivated ..!" });
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
});
exports.userViewProfileController = userViewProfileController;
const userAddContactNumberController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = request.payload.email;
        const { contactNumber } = request.body;
        // console.log('Hello from userAddContactNumberController ..!',userEmail,'  ',contactNumber);
        if (!userEmail) {
            response.status(404).json({ message: "Token not found" });
        }
        else {
            const userData = yield userModel_1.default.findOneAndUpdate({ email: userEmail }, { contactNumber }, { new: true });
            if (userData === null || userData === void 0 ? void 0 : userData.status) {
                return response.status(201).json({ userData: userData, message: "Contact number updated successfully!" });
            }
            else {
                return response.status(404).json({ userData: null, message: "The account you are trying to access has been deactivated!" });
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
});
exports.userAddContactNumberController = userAddContactNumberController;
const userRaiseQueryController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = request.payload;
        const { subject, message } = request.body;
        const similaryExistingQuery = yield queryModel_1.default.findOne({ userEmail: email, userRole: role, subject, message });
        if (!similaryExistingQuery) {
            const updatedQuery = yield queryModel_1.default.create({
                userEmail: email,
                userRole: role,
                subject,
                message,
                conversation: [{
                        sender: email,
                        message: message,
                        role: role,
                        timestamp: new Date()
                    }]
            });
            return response.status(201).json({ updatedQuery, message: "Your query has been successfully published ..!" });
        }
        else {
            return response.status(400).json({ message: "A similar query has already been added by you ..!" });
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Failed to create query' });
    }
});
exports.userRaiseQueryController = userRaiseQueryController;
// according to pagination page = current Page Number, limit = number of Documents
const userGetQueriesController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = request.payload;
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 4;
        const numberOfDocsToSkip = (page - 1) * limit;
        const total = yield queryModel_1.default.countDocuments(); // 3
        const myQueries = yield queryModel_1.default.find({ userEmail: email, userRole: role }).skip(numberOfDocsToSkip).limit(limit);
        console.log('My Queries : ', myQueries);
        console.log('Page  : ', page);
        console.log('limit : ', limit);
        console.log('Total Queries : ', total);
        response.json({
            page,
            limit,
            total,
            myQueries: myQueries
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Failed to create query' });
    }
});
exports.userGetQueriesController = userGetQueriesController;
const userViewMyQueriesController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = request.payload;
        const myQueries = yield queryModel_1.default.find({ userEmail: email, userRole: role });
        console.log(`RaisedQuery by  ${myQueries} : `);
        if (myQueries) {
            return response.status(201).json({ myQueries: myQueries, message: "These are the recently raised queries by you ..!" });
        }
        else {
            throw new Error('Queries not found ..!');
        }
    }
    catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
});
exports.userViewMyQueriesController = userViewMyQueriesController;
const userAuthenticationController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = yield (0, jwt_1.tokenVerifier)(token, config_1.USER_SECRET_KEY);
        const userData = yield userModel_1.default.findOne({ email: payload.email });
        console.log('userData : ', userData, '  token in userAuthenticationController : ', token);
        response.status(201).json({ userData: userData, token: token, message: "Authenntication Successfull ..!" });
    }
    catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(500).json({ message: 'Token Not verify please login then try to access ..!' });
    }
});
exports.userAuthenticationController = userAuthenticationController;
// for backend
const userAuthenticateJWT = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = yield (0, jwt_1.tokenVerifier)(token, config_1.USER_SECRET_KEY);
        request.payload = payload;
        next();
    }
    catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
});
exports.userAuthenticateJWT = userAuthenticateJWT;
