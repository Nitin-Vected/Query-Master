"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("./model/connection");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const config_1 = require("./config");
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const app = (0, express_1.default)();
(0, connection_1.connectDB)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/user', userRouter_1.default);
app.use('/admin', adminRouter_1.default);
app.listen(config_1.PORT, () => {
    console.log(`Server is running on http://localhost:${config_1.PORT}`);
});
