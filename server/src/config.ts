import { Request } from 'express';
import dotenv from "dotenv";
import queryModel from "./model/queryModel";
import courseModel from "./model/courseModel";
import shortid from 'shortid';
import roleModel from "./model/roleModel";
import userModel from "./model/userModel";
import batchModel from "./model/batchModel";
import employeeModel from "./model/employeeModel";
import statusModel from "./model/statusModel";
import orderModel from "./model/orderModel";
import paymentModel from "./model/paymentModel";
import transactionModel from "./model/transactionModel";
import studentModel from "./model/studentModel";
dotenv.config();

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING as string;
export const PORT: string = process.env.PORT as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
export const COUNSELLOR_SECRET_KEY: string = process.env.COUNSELLOR_SECRET_KEY as string;
export const GOOGLE_DECODE_TOKEN_API: string = process.env.GOOGLE_DECODE_TOKEN_API as string;
export const STUDENT_ROLE_ID = "ROLEGnd3oTjQX01";
export const SUPPORT_ADIMIN_ROLE_ID = "ROLEuvsBMYopB02";
export const COUNSELLOR_ROLE_ID = "ROLERQ80Z9Ctm03";
export const TRAINER_ROLE_ID = "ROLEtEUJrkc0r04";

export const StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    ALREADY_EXIST: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

interface UserPayload {
    userId: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
}

export interface CustomRequest extends Request {
    payload?: UserPayload;
}

export const generateUniqueId = async (mode: string, email?: string, role?: string) => {
    try {
        console.log('mode ==> ', mode)
        let isUnique = false;
        let newUniqueId = '';
        switch (mode) {
            case 'query': {
                const latestQuery = await queryModel.findOne({ userEmail: email, userRole: role }).sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;
                if (latestQuery && latestQuery.queryId) {
                    const numericPart = latestQuery.queryId.match(/\d+$/);
                    if (numericPart) {
                        newCounter = parseInt(numericPart[0]) + 1;
                    };
                }
                while (!isUnique) {
                    const uniqueId = shortid.generate();;
                    newUniqueId = `QRY${uniqueId}0${newCounter}`;
                    console.log(`Generated Query ID: ${newUniqueId}`);
                    const existingQuery = await queryModel.findOne({ queryId: newUniqueId });
                    if (!existingQuery) {
                        isUnique = true;
                    } else {
                        console.log('Query ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'role': {
                const latestRole = await roleModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestRole.length > 0) {
                    const role = latestRole[0];
                    if (role.roleId) {
                        const numericPart = role.roleId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `ROLE${uniqueId}0${newCounter}`;
                    console.log(`Generated Role ID: ${newUniqueId}`);

                    const existingRole = await roleModel.findOne({ roleId: newUniqueId });
                    if (!existingRole) {
                        isUnique = true;
                    } else {
                        console.log('Role ID collision, regenerating...');
                    }
                }

                return newUniqueId;

            }
            case 'course': {
                const latestCourse = await courseModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestCourse.length > 0) {
                    const course = latestCourse[0];
                    if (course.courseId) {
                        const numericPart = course.courseId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `COURSE${uniqueId}0${newCounter}`;
                    console.log(`Generated Course ID: ${newUniqueId}`);

                    const existingRole = await courseModel.findOne({ courseId: newUniqueId });
                    if (!existingRole) {
                        isUnique = true;
                    } else {
                        console.log('Course ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'user': {
                const latestUser = await userModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestUser.length > 0) {
                    const userData = latestUser[0];
                    if (userData.userId) {
                        const numericPart = userData.userId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `USER${uniqueId}0${newCounter}`;
                    console.log(`Generated User ID: ${newUniqueId}`);

                    const existingUserWithSameId = await userModel.findOne({ userId: newUniqueId });
                    if (!existingUserWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('User ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'batch': {
                const latestBatch = await batchModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestBatch.length > 0) {
                    const userData = latestBatch[0];
                    if (userData.batchId) {
                        const numericPart = userData.batchId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `BATCH${uniqueId}0${newCounter}`;
                    console.log(`Generated Batch ID: ${newUniqueId}`);

                    const existingBatchWithSameId = await batchModel.findOne({ batchId: newUniqueId });
                    if (!existingBatchWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('User ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'employee': {
                const latestEmployee = await employeeModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestEmployee.length > 0) {
                    const userData = latestEmployee[0];
                    if (userData.employeeId) {
                        const numericPart = userData.employeeId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `EMP${uniqueId}0${newCounter}`;
                    console.log(`Generated Employee ID: ${newUniqueId}`);

                    const existingEmployeeWithSameId = await employeeModel.findOne({ employeeId: newUniqueId });
                    if (!existingEmployeeWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('Employee ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'status': {
                const latestStatus = await statusModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestStatus.length > 0) {
                    const statusData = latestStatus[0];
                    if (statusData.statusId) {
                        const numericPart = statusData.statusId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `STATUS${uniqueId}0${newCounter}`;
                    console.log(`Generated Status ID: ${newUniqueId}`);

                    const existingStatusWithSameId = await statusModel.findOne({ statusId: newUniqueId });
                    if (!existingStatusWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('Status ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'order': {
                const latestOrder = await orderModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestOrder.length > 0) {
                    const orderData = latestOrder[0];
                    if (orderData.orderId) {
                        const numericPart = orderData.orderId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `ORDER${uniqueId}0${newCounter}`;
                    console.log(`Generated Order ID: ${newUniqueId}`);

                    const existingOrderWithSameId = await orderModel.findOne({ orderId: newUniqueId });
                    if (!existingOrderWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('Status ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'payment': {
                const latestPayment = await paymentModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestPayment.length > 0) {
                    const paymentData = latestPayment[0];
                    if (paymentData.paymentId) {
                        const numericPart = paymentData.paymentId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `PYMT${uniqueId}0${newCounter}`;
                    console.log(`Generated Payment ID: ${newUniqueId}`);

                    const existingPaymentWithSameId = await paymentModel.findOne({ paymentId: newUniqueId });
                    if (!existingPaymentWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('Payment ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'transaction': {
                const latestTransaction = await transactionModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestTransaction.length > 0) {
                    const transactionData = latestTransaction[0];
                    if (transactionData.transactionId) {
                        const numericPart = transactionData.transactionId.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `TRNS${uniqueId}0${newCounter}`;
                    console.log(`Generated Transaction ID: ${newUniqueId}`);

                    const existingTransactionWithSameId = await transactionModel.findOne({ transactionId: newUniqueId });
                    if (!existingTransactionWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('Transaction ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
            case 'enrollment': {
                const latestStudent = await studentModel.find().sort({ createdAt: -1 }).limit(1);
                let newCounter = 1;

                if (latestStudent.length > 0) {
                    const studentData = latestStudent[0];
                    if (studentData.enrollmentNumber) {
                        const numericPart = studentData.enrollmentNumber.match(/\d+$/);
                        if (numericPart) {
                            newCounter = parseInt(numericPart[0]) + 1;
                        }
                    }
                }

                while (!isUnique) {
                    const uniqueId = shortid.generate();
                    newUniqueId = `10VSA000${newCounter}`;
                    console.log(`Generated Student Enrollment Number: ${newUniqueId}`);

                    const existingEnrollmentNumber = await studentModel.findOne({ enrollmentNumber: newUniqueId });
                    if (!existingEnrollmentNumber) {
                        isUnique = true;
                    } else {
                        console.log('Enrollment Number collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
        }

    } catch (error) {
        console.error('Error generating Status ID:', error);
        throw error;
    }
}