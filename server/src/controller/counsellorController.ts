import express from "express";
import leadModel from "../model/leadModel";
import {
  COUNSELLOR_SECRET_KEY,
  STUDENT_ROLE_ID,
  StatusCodes,
  generateUniqueId,
} from "../config";
import { Request, Response, NextFunction } from "express";
import { tokenVerifier } from "../utilities/jwt";
import studentModel from "../model/studentModel";
import userModel from "../model/userModel";
import transactionModel from "../model/transactionModel";
import { deleteFile } from "../utilities/deleteUploadedFile";
import orderModel from "../model/orderModel";
import paymentModel from "../model/paymentModel";
import mongoose from "mongoose";

export const counsellorViewProfileController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { userId, roleId, roleName } = request.payload;
    if (!userId || !roleId) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.findOne({ userId, roleId });     
      console.log("result : ", result);
      const counsellorData = {
        name: result?.firstName + " " + result?.lastName,
        email: result?.email,
        contactNumber: result?.contactNumber,
        role: roleName,
        profileImg: result?.profileImg,
      };
      if (result?.status) {
        response.status(StatusCodes.OK).json({
          counsellorData: counsellorData,
          message: "This is your desired data ..!",
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).json({
          counsellorData: null,
          message:
            "The Account You are Trying to Access has been Deactivated ..!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};


export const counsellorManageLeadStatusController = async (request: Request, response: Response) => {
  try {
    const { email, statusId } = request.body;
    console.log("Lead email: ", email, "  action: ", statusId);

    if (!email || !statusId) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email, Course ID, and action are required" });
    }
    const result = await leadModel.updateOne(
      { email: email },
      { $set: { "statusId": statusId } }
    );

    console.log(result);

    if (result?.acknowledged) {
      return response
        .status(StatusCodes.OK)
        .json({ message: "Lead status has been updated successfully!" });
    } else {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead or course not found." });
    }

  } catch (error) {
    console.error("Error updating lead status: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

export const consellorRegisterLeadAsUserController = async (request: any, response: Response, next: NextFunction) => {
  let uploadedFilePath = '';
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { email: counsellorEmail, roleName } = request.payload;
    let { email: leadEmail, name, contactNumber, paymentMode, paymentType, transactionDate,
      transactionAmount, emiDetails, discount, finalAmount, coursesPurchased, statusId } = request.body;

    const missingField = Object.entries(request.body).find(([key, value]) => !value);

    if (missingField) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please Enter all the required fields and try again ..!" });
    }

    const transactionProof = request.file?.path;
    uploadedFilePath = transactionProof;

    const [firstName, lastName] = name.split(" ");
    const userId = await generateUniqueId("user");

    const result = await userModel.create({
      userId,
      email: leadEmail,
      firstName,
      lastName,
      status: true,
      roleId: STUDENT_ROLE_ID,
      contactNumber,
    });

    if (!result) {
      throw new Error('Failed to create user');
    }

    const transactionId = await generateUniqueId('transaction');
    const transactionData = {
      transactionId,
      userId,
      paymentMode,
      paymentType,
      transactionDate,
      transactionAmount,
      transactionProof,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      creatorRole: roleName,
      updaterRole: roleName
    };

    const newTransaction = await transactionModel.create([transactionData], { session });
    if (!newTransaction) {
      throw new Error('Transaction creation failed');
    }

    const orderId = await generateUniqueId("order");
    const orderData = {
      orderId,
      userId,
      transactionId,
      coursesPurchased: coursesPurchased,
      finalAmount: finalAmount,
      discount: discount,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      creatorRole: roleName,
      updaterRole: roleName
    };

    const newOrder = await orderModel.create([orderData], { session });
    if (!newOrder) {
      throw new Error('Order creation failed');
    }

    const paymentId = await generateUniqueId("payment");
    if (paymentType === "EMI" && emiDetails) {
      emiDetails = {
        emiCount: emiDetails.emiCount,
        installments: emiDetails.installments,
      };
    } else if (paymentType === "OneTime Payment") {
      emiDetails = {
        emiCount: 1,
        installments: [{
          dueDate: Date.now(),
          transactionAmount,
          status: "Paid",
        }]
      };
    }

    const paymentDetails = {
      paymentId,
      orderId,
      emiDetails,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      creatorRole: roleName,
      updaterRole: roleName
    };

    const paymentResult = await paymentModel.create([paymentDetails], { session });
    if (!paymentResult) {
      throw new Error('Payment creation failed');
    }

    const leadStatusResult = await leadModel.updateOne(
      { email: leadEmail },
      { $set: { "statusId": statusId } },
      { session }
    );

    if (!leadStatusResult?.acknowledged) {
      throw new Error('Lead status update failed');
    }

    const enrollmentNumber = await generateUniqueId("enrollment");

    const studentData = {
      enrollmentNumber,
      coursesEnrolled: coursesPurchased,
      userId,
      transactions: [transactionId],
      fees: finalAmount,
      discount,
      enrollmentDate: transactionDate,
      createdBy: counsellorEmail,
      updatedBy: counsellorEmail,
      creatorRole: roleName,
      updaterRole: roleName
    }
    const studentResult = await studentModel.create([studentData], { session });
    if (!studentResult) {
      throw new Error('Student registration failed');
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    response.status(StatusCodes.CREATED).json({ message: 'Student Enrolled Successfully ..!' });

  } catch (error) {
    await userModel.deleteOne({ email: request.body.email });
    deleteFile(uploadedFilePath);
    console.error("Error registering lead as user: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

// export const counsellorAddTransactionDetailsController = async (request: any, response: Response) => {
//   let uploadedFilePath = '';
//   let session: mongoose.ClientSession | null = null;

//   try {
//     session = await mongoose.startSession();
//     session.startTransaction();

//     const { email:counsellorEmail, roleName } = request.payload;
//     const userId = request.userId;
//     const leadEmail = request.leadEmail;
//     const transactionId = await generateUniqueId('transaction');
//     let { paymentMode, paymentType, transactionDate, transactionAmount,
//       emiDetails, discount, finalAmount, coursesPurchased, statusId } = request.body;

//     const transactionProof = request.file?.path;
//     uploadedFilePath = transactionProof;

//     const transactionData = {
//       transactionId,
//       userId,
//       paymentMode,
//       paymentType,
//       transactionDate,
//       transactionAmount,
//       transactionProof,
//       createdBy: counsellorEmail,
//       updatedBy: counsellorEmail,
//       creatorRole: roleName,
//       updaterRole: roleName
//     };

//     const newTransaction = await transactionModel.create([transactionData], { session });
//     if (!newTransaction) {
//       throw new Error('Transaction creation failed');
//     }

//     const orderId = await generateUniqueId("order");
//     const orderData = {
//       orderId,
//       userId,
//       transactionId,
//       coursesPurchased: coursesPurchased,
//       finalAmount: finalAmount,
//       discount: discount,
//       createdBy: counsellorEmail,
//       updatedBy: counsellorEmail,
//       creatorRole: roleName,
//       updaterRole: roleName
//     };

//     const newOrder = await orderModel.create([orderData], { session });
//     if (!newOrder) {
//       throw new Error('Order creation failed');
//     }

//     const paymentId = await generateUniqueId("payment");
//     if (paymentType === "EMI" && emiDetails) {
//       emiDetails = {
//         emiCount: emiDetails.emiCount,
//         installments: emiDetails.installments,
//       };
//     } else if (paymentType === "OneTime Payment") {
//       emiDetails = {
//         emiCount: 1,
//         installments: [{
//           dueDate: Date.now(),
//           transactionAmount,
//           status: "Paid",
//         }]
//       };
//     }

//     const paymentDetails = {
//       paymentId,
//       orderId,
//       emiDetails,
//       createdBy: counsellorEmail,
//       updatedBy: counsellorEmail,
//       creatorRole: roleName,
//       updaterRole: roleName
//     };

//     const paymentResult = await paymentModel.create([paymentDetails], { session });
//     if (!paymentResult) {
//       throw new Error('Payment creation failed');
//     }

//     const result = await leadModel.updateOne(
//       { email: leadEmail },
//       { $set: { "statusId": statusId } },
//       { session }
//     );

//     if (!result?.acknowledged) {
//       throw new Error('Lead status update failed');
//     }

//     const enrollmentNumber = await generateUniqueId("enrollment");

//     const studentData = {
//       enrollmentNumber,
//       coursesEnrolled: coursesPurchased,
//       userId,
//       transactions: [transactionId],
//       fees: finalAmount,
//       discount,
//       enrollmentDate: transactionDate,
//       createdBy: counsellorEmail,
//       updatedBy: counsellorEmail,
//       creatorRole: roleName,
//       updaterRole: roleName
//     }
//     const studentResult = await studentModel.create([studentData], { session });
//     if (!studentResult) {
//       throw new Error('Student registration failed');
//     }

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     response.status(StatusCodes.CREATED).json({ message: 'Student Enrolled Successfully ..!' });

//   } catch (error) {
//     if (session) {
//       await session.abortTransaction();
//       session.endSession();
//     }
//     deleteFile(uploadedFilePath);
//     console.error("Error in transaction process: ", error);
//     return response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Something went wrong, rolling back changes." });
//   }
// };


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

export const addNewLeadsController = async (
  request: any,
  response: Response
) => {
  try {
    const { email, roleName } = request.payload;
    const leads = Array.isArray(request.body) ? request.body : [request.body];

    const result = [];
    for (const leadData of leads) {
      const { email: leadEmail, courseCategory } = leadData;

      let existingLead = await leadModel.findOne({ email: leadEmail });

      if (existingLead) {
        console.log("Lead already exists. Updating courseCategory.");

        // Check if the course already exists in the lead's courses array
        const existingCourse = existingLead.courses.find(
          (category) => category.courseId === courseCategory[0].courseId
        );

        if (!existingCourse) {
          existingLead.courses.push(courseCategory[0]);
          existingLead.updatedBy = email;
          existingLead.updaterRole = roleName;
          await existingLead.save();
        } else {
          console.log("Course already exists in the lead’s courseCategory.");
        }

        result.push(existingLead);
      } else {
        console.log("Lead does not exist. Creating a new lead.");
        const newLeadData = {
          ...leadData,
          createdBy: email,
          updatedBy: email,
          createrRole: roleName,
          updaterRole: roleName,
        };

        const newLead = await leadModel.create(newLeadData);
        result.push(newLead);
      }
    }

    console.log("Result: ", result);
    response
      .status(StatusCodes.CREATED)
      .json({ data: result, message: "Leads processed successfully." });
  } catch (error) {
    console.error("Error occurred in addNewLeads: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};

export const getAllLeadsController = async (
  request: Request,
  response: Response
) => {
  try {
    const leads = await leadModel.find();
    if (leads) {
      response.status(StatusCodes.OK).json({
        leads: leads,
        message: "These are the leads created by you!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ myQueries: null, message: "No Leads are added by You!" });
    }
  } catch (error) {
    console.log("Error occured in getAllLeads : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getLeadByIdController = async (
  request: Request,
  response: Response
) => {
  const { leadId } = request.params;
  console.log(request.params);

  try {
    const lead = await leadModel.findById(leadId);
    console.log(lead);
    
    if (!lead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead not found" });
    }
    response.status(200).json({ data: lead, message: "Lead of given id" });
  } catch (error) {
    console.log("Error occured in getLeadById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const counsellorAuthenticateJWT = async (
  request: any,
  response: express.Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await tokenVerifier(token, COUNSELLOR_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired Candidate token" });
  }
};
