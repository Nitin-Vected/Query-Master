import { Request } from "express";
import dotenv from "dotenv";
import courseModel from "./model/productModel";
import shortid from "shortid";
import roleModel from "./model/roleModel";
import userModel from "./model/userModel";
import statusModel from "./model/statusModel";
import orderModel from "./model/orderModel";
import transactionModel from "./model/transactionModel";
import studentModel from "./model/studentModel";
import channelModal from "./model/channelModel";
import leadModel from "./model/leadModel";
dotenv.config();

export const CONNECTION_STRING: string = process.env
  .CONNECTION_STRING as string;
export const PORT: string = process.env.PORT as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
export const COUNSELLOR_SECRET_KEY: string = process.env
  .COUNSELLOR_SECRET_KEY as string;
export const GOOGLE_DECODE_TOKEN_API: string = process.env
  .GOOGLE_DECODE_TOKEN_API as string;
export const STUDENT_ROLE_ID = "ROLEGnd3oTjQX01";
export const SUPPORT_ADMIN_ROLE_ID = "ROLEuvsBMYopB02";
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

export const generateUniqueId = async (mode: string) => {
  try {
    let isUnique = false;
    let newUniqueId = "";
    switch (mode) {
      case "role": {
        const latestRole = await roleModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestRole.length > 0) {
          const role = latestRole[0];
          if (role.id) {
            const numericPart = role.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `ROLE${uniqueId}0${newCounter}`;
          console.log(`Generated Role ID: ${newUniqueId}`);

          const existingRole = await roleModel.findOne({ id: newUniqueId });
          if (!existingRole) {
            isUnique = true;
          } else {
            console.log("Role ID collision, regenerating...");
          }
        }

        return newUniqueId;
      }
      case "lead": {
        const latestLead = await leadModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestLead.length > 0) {
          const lead = latestLead[0];
          if (lead.id) {
            const numericPart = lead.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `LEAD${uniqueId}0${newCounter}`;
          console.log(`Generated Lead ID: ${newUniqueId}`);

          const existingLead = await leadModel.findOne({ id: newUniqueId });
          if (!existingLead) {
            isUnique = true;
          } else {
            console.log("Lead ID collision, regenerating...");
          }
        }

        return newUniqueId;
      }
      case "course": {
        const latestCourse = await courseModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestCourse.length > 0) {
          const course = latestCourse[0];
          if (course.id) {
            const numericPart = course.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `COURSE${uniqueId}0${newCounter}`;
          console.log(`Generated Course ID: ${newUniqueId}`);

          const existingRole = await courseModel.findOne({
            courseId: newUniqueId,
          });
          if (!existingRole) {
            isUnique = true;
          } else {
            console.log("Course ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "channel": {
        const latestChannel = await channelModal
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestChannel.length > 0) {
          const channel = latestChannel[0];
          if (channel.id) {
            const numericPart = channel.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `CHANNEL${uniqueId}0${newCounter}`;
          console.log(`Generated Channel ID: ${newUniqueId}`);

          const existingRole = await channelModal.findOne({
            id: newUniqueId,
          });
          if (!existingRole) {
            isUnique = true;
          } else {
            console.log("channel ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "user": {
        const latestUser = await userModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestUser.length > 0) {
          const userData = latestUser[0];
          if (userData.id) {
            const numericPart = userData.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `USER${uniqueId}0${newCounter}`;
          console.log(`Generated User ID: ${newUniqueId}`);

          const existingUserWithSameId = await userModel.findOne({
            id: newUniqueId,
          });
          if (!existingUserWithSameId) {
            isUnique = true;
          } else {
            console.log("User ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "status": {
        const latestStatus = await statusModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestStatus.length > 0) {
          const statusData = latestStatus[0];
          if (statusData.id) {
            const numericPart = statusData.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `STATUS${uniqueId}0${newCounter}`;
          console.log(`Generated Status ID: ${newUniqueId}`);

          const existingStatusWithSameId = await statusModel.findOne({
            id: newUniqueId,
          });
          if (!existingStatusWithSameId) {
            isUnique = true;
          } else {
            console.log("Status ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "order": {
        const latestOrder = await orderModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestOrder.length > 0) {
          const orderData = latestOrder[0];
          if (orderData.id) {
            const numericPart = orderData.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `ORDER${uniqueId}0${newCounter}`;
          console.log(`Generated Order ID: ${newUniqueId}`);

          const existingOrderWithSameId = await orderModel.findOne({
            id: newUniqueId,
          });
          if (!existingOrderWithSameId) {
            isUnique = true;
          } else {
            console.log("Status ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "transaction": {
        const latestTransaction = await transactionModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
        let newCounter = 1;

        if (latestTransaction.length > 0) {
          const transactionData = latestTransaction[0];
          if (transactionData.id) {
            const numericPart = transactionData.id.match(/\d+$/);
            if (numericPart) {
              newCounter = parseInt(numericPart[0]) + 1;
            }
          }
        }

        while (!isUnique) {
          const uniqueId = shortid.generate();
          newUniqueId = `TRNS${uniqueId}0${newCounter}`;
          console.log(`Generated Transaction ID: ${newUniqueId}`);

          const existingTransactionWithSameId = await transactionModel.findOne({
            id: newUniqueId,
          });
          if (!existingTransactionWithSameId) {
            isUnique = true;
          } else {
            console.log("Transaction ID collision, regenerating...");
          }
        }
        return newUniqueId;
      }
      case "enrollment": {
        const latestStudent = await studentModel
          .find()
          .sort({ createdAt: -1 })
          .limit(1);
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

          const existingEnrollmentNumber = await studentModel.findOne({
            enrollmentNumber: newUniqueId,
          });
          if (!existingEnrollmentNumber) {
            isUnique = true;
          } else {
            console.log("Enrollment Number collision, regenerating...");
          }
        }
        return newUniqueId;
      }
    }
  } catch (error) {
    console.error("Error generating Status ID:", error);
    throw error;
  }
};

const getNextEnrollmentId = async (): Promise<string> => {
  const lastStudent = await studentModel.findOne().sort({ _id: -1 });

  let newEnrollmentNumber: string;
  if (lastStudent && lastStudent.enrollmentNumber) {
    const lastEnrollmentNumber = parseInt(
      lastStudent.enrollmentNumber.replace("VSA", ""),
      10
    );
    const nextEnrollmentNumber = lastEnrollmentNumber + 1;
    newEnrollmentNumber = `VSA${String(nextEnrollmentNumber).padStart(4, "0")}`;
  } else {
    newEnrollmentNumber = "VSA0001";
  }

  return newEnrollmentNumber;
};
