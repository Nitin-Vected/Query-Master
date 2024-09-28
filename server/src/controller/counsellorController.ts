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
import orderModel from "../model/orderModel";

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
          message: "This is your dersired data ..!",
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).json({
          counsellorData: null,
          message:
            "The Account You are Trying to Acces has been Deactivated ..!",
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
    const { email, courseId, statusId } = request.body;
    console.log("Lead email: ", email, "  action: ", statusId);

    if (!email || !courseId || !statusId) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email, Course ID, and action are required" });
    }
    const result = await leadModel.updateOne(
      { email: email, "courses.courseId": courseId },
      { $set: { "courses.$.statusId": statusId } }
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
  try {
    const { name, contactNumber, email } = request.body;
    const missingField = Object.entries(request.body).find(([key, value]) => !value);
    if (missingField) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please Enter all the required fields and try again ..!" });
    }
    const [firstName, lastName] = name.split(" ");
    const userId = await generateUniqueId("user");
    const result = await userModel.create({
      userId,
      email,
      firstName,
      lastName,
      status: true,
      roleId: STUDENT_ROLE_ID,
      contactNumber,
    });
    if (result) {
      request.userId = userId;
      next();
    }
  } catch (error) {
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

export const counsellorAddTransactionDetailsController = async (request: any, response: Response, next: NextFunction) => {
  try {
    const userId = request.userId;
    const transactionId = await generateUniqueId('transaction');
    const {paymentMode,paymentType, transactionDate, transactionAmount, transactionProof} = request.body;


  } catch (error) {
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, please try again." });
  }
};

export const addNewOrderController = async (request: any, response: Response) => {
  try {
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { userId, transactionId, discount, finalAmount, coursesPurchased } = request.body;
    const orderId = await generateUniqueId("order");
    const data = {
      orderId,
      userId: userId,
      transactionId: transactionId,
      finalAmount: finalAmount,
      discount: discount,
      coursesPurchased: coursesPurchased,
      createdBy: email,
      updatedBy: email,
      creatorRole: roleName,
      updaterRole: roleName
    }
    console.log(data)
    const newOrder = await orderModel.create(data);
    if (newOrder) {
      response.status(StatusCodes.CREATED).json({
        message: 'Order Added successfully ..!',
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something Went Wrong ..!',
      });
    }
  } catch (error) {
    console.error("Error in addNewOrderController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
}

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
  request: Request,
  response: Response
) => {
  try {
    const leads = Array.isArray(request.body) ? request.body : [request.body];

    const result = [];
    for (const leadData of leads) {
      const { email, courseCategory } = leadData;

      let existingLead = await leadModel.findOne({ email });

      if (existingLead) {
        console.log("Lead already exists. Updating courseCategory.");

        const existingCourse = existingLead.courses.find(
          (category) => category.courseId === courseCategory[0].courseId
        );

        if (!existingCourse) {
          existingLead.courses.push(courseCategory[0]);
          await existingLead.save();
        } else {
          console.log("Course already exists in the lead’s courseCategory.");
        }

        result.push(existingLead);
      } else {
        console.log("Lead does not exist. Creating a new lead.");
        const newLead = await leadModel.create(leadData);
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
  const { id } = request.params;

  try {
    const lead = await leadModel.findById(id);
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

export const updateCourseCategoryStatusController = async (
  request: Request,
  response: Response
) => {
  const { leadId, courseId, newStatusId } = request.body;
  try {
    const lead = await leadModel.findById(leadId);

    if (!lead) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Lead not found" });
    }

    const courseApp = lead.courses.find(
      (app) => app.courseId === courseId
    );

    if (!courseApp) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course application not found" });
    }

    courseApp.statusId = newStatusId;
    await lead.save();
    response
      .status(StatusCodes.OK)
      .json({ data: lead, message: "Status Updated Successfully" });
  } catch (error) {
    console.log("Error occured in addNewLeads : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const createUserAndStudentController = async (
  request: Request,
  response: Response
) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    profileImg,
    roleId,
    status,
    batchId,
    courseId,
    queryId,
    transactions,
    fees,
    discount,
    enrollmentDate,
    createdBy,
    creatorRole,
  } = request.body;

  try {
    const userId = generateUniqueId("user");

    const enrollmentNumber = await getNextEnrollmentId();

    if (!transactions || transactions.length === 0) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Transactions field must not be empty",
      });
    }

    const newUser = new userModel({
      userId,
      firstName,
      lastName,
      email,
      contactNumber,
      profileImg,
      roleId,
      status,
    });

    await newUser.save();

    const newStudent = new studentModel({
      enrollmentNumber,
      userId: newUser.userId,
      batchId,
      courseId,
      queryId,
      transactions,
      fees,
      discount,
      enrollmentDate,
      createdBy,
      updatedBy: createdBy,
      creatorRole,
      updatorRole: creatorRole,
    });

    await newStudent.save();

    response.status(StatusCodes.CREATED).json({
      message: "User and Student created successfully",
      user: newUser,
      student: newStudent,
    });
  } catch (error) {
    console.log("Error occured in createUserAndStudentController : ", error);
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
