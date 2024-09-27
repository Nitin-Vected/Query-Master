import express from "express";
import leadModel from "../model/leadModel";
import { COUNSELLOR_SECRET_KEY, StatusCodes, generateUniqueId } from "../config";
import { Request, Response } from "express";
import { tokenVerifier } from "../utilities/jwt";
import studentModel from "../model/studentModel";
import userModel from "../model/userModel";

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

export const addNewLeadsController = async (request: Request, response: Response) => {
  try {
    const leads = Array.isArray(request.body) ? request.body : [request.body];
    const result = await leadModel.insertMany(leads);
    console.log('lead : ',leads)
    console.log('result : ',result)
    response
      .status(StatusCodes.CREATED)
      .json({ data: result, message: "Leads created Successfully..." });
  } catch (error) {
    console.log("Error occured in addNewLeads : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getAllLeadsController = async (request: Request, response: Response) => {
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

export const getLeadByIdController = async (request: Request, response: Response) => {
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

export const updateCourseApplicationStatusController = async (
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

    const courseApp = lead.courseCategory.find(
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
