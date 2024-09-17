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
exports.adminAuthenticateJWT = exports.adminAuthenticationController = exports.adminResponseController = exports.adminRaiseQueryController = exports.adminViewRaisedQueryListController = exports.adminAddContactNumberController = exports.adminViewProfileController = void 0;
const jwt_1 = require("../utilities/jwt");
const config_1 = require("../config");
const queryModel_1 = __importDefault(require("../model/queryModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const adminViewProfileController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = request.payload;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        }
        else {
            const adminData = yield userModel_1.default.findOne({ email, role });
            if (adminData === null || adminData === void 0 ? void 0 : adminData.status) {
                response.status(201).json({ adminData: adminData, message: "This is your dersired data ..!" });
            }
            else {
                response.status(404).json({ adminData: null, message: "The Account You are Trying to Acces has been Deactivated ..!" });
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
});
exports.adminViewProfileController = adminViewProfileController;
const adminAddContactNumberController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = request.payload;
        const { contactNumber } = request.body;
        console.log('Hello from adminAddContactNumberController ..!');
        if (!email || !role) {
            response.status(404).json({ message: "Token not found" });
        }
        else {
            const adminData = yield userModel_1.default.findOneAndUpdate({ email, role }, { contactNumber }, { new: true });
            if (adminData === null || adminData === void 0 ? void 0 : adminData.status) {
                console.log('Contact Number added successfully ..!');
                return response.status(201).json({ adminData: adminData, message: "Contact number updated successfully!" });
            }
            else {
                return response.status(404).json({ adminData: null, message: "The account you are trying to access has been deactivated!" });
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
});
exports.adminAddContactNumberController = adminAddContactNumberController;
const adminViewRaisedQueryListController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const raisedQueries = yield queryModel_1.default.find();
        console.log(`RaisedQuery by  ${raisedQueries} : `);
        if (raisedQueries) {
            return response.status(201).json({ raisedQueries: raisedQueries, message: "These are the recently raised queries ..!" });
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
exports.adminViewRaisedQueryListController = adminViewRaisedQueryListController;
const adminRaiseQueryController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.adminRaiseQueryController = adminRaiseQueryController;
const adminResponseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { queryId } = request.params;
        const { sender, message } = request.body;
        console.log('QueryId : ', queryId);
        // Find the query by its _id
        const query = yield queryModel_1.default.findOne({ _id: Object(queryId) }); // No need to wrap in Object()
        if (!query) {
            return response.status(404).json({ error: 'Query not found' });
        }
        else if ((query === null || query === void 0 ? void 0 : query.status) === "Open") {
            query.conversation.push({
                sender,
                message,
                role: (_a = request.payload) === null || _a === void 0 ? void 0 : _a.role,
                timestamp: new Date()
            });
            yield query.save();
            response.status(201).json({ query, message: "Your response has been sent to the Inquirer successfully!" });
        }
        else {
            response.status(500).json({ error: 'Query has been closed by the user!' });
        }
        console.log('Query in adminResponseController : ', query);
        // You can proceed with other logic after the query is found
        // Example:
        // response.status(200).json({ query });
    }
    catch (error) {
        response.status(500).json({ error: 'Failed to find query' });
    }
});
exports.adminResponseController = adminResponseController;
const adminAuthenticationController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = yield (0, jwt_1.tokenVerifier)(token, config_1.ADMIN_SECRET_KEY);
        const adminData = yield userModel_1.default.findOne({ email: payload.email, role: payload.role });
        console.log('userData : ', adminData, '  token in adminAuthenticationController : ', token);
        response.status(201).json({ userData: adminData, token: token, message: "Authenntication Successfull ..!" });
    }
    catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(500).json({ message: 'Token Not verify please login then try to access ..!' });
    }
});
exports.adminAuthenticationController = adminAuthenticationController;
// for backend
const adminAuthenticateJWT = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = yield (0, jwt_1.tokenVerifier)(token, config_1.ADMIN_SECRET_KEY);
        request.payload = payload;
        next();
    }
    catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
});
exports.adminAuthenticateJWT = adminAuthenticateJWT;
