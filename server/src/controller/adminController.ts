import express from "express";
import { tokenVerifier } from "../utilities/jwt";
import {
  ADMIN_SECRET_KEY,
  COUNSELLOR_ROLE_ID,
  generateUniqueId,
  StatusCodes,
  STUDENT_ROLE_ID,
  SUPPORT_ADIMIN_ROLE_ID,
  TRAINER_ROLE_ID,
} from "../config";
import queryModel from "../model/queryModel";
import userModel from "../model/userModel";
import roleModel from "../model/roleModel";
import batchModel from "../model/batchModel";
import courseModel from "../model/courseModel";
import employeeModel from "../model/employeeModel";
import { AccessRights } from "../model/accessRightsModel";
import statusModel from "../model/statusModel";
import paymentModel from "../model/paymentModel";
import orderModel from "../model/orderModel";

export const adminViewProfileController = async (
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
      const adminData = {
        name: result?.firstName + " " + result?.lastName,
        email: result?.email,
        contactNumber: result?.contactNumber,
        role: roleName,
        profileImg: result?.profileImg,
      };
      if (result?.status) {
        response.status(StatusCodes.OK).json({
          adminData: adminData,
          message: "This is your dersired data ..!",
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).json({
          adminData: null,
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

export const adminViewRaisedQueryListController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const raisedQueries = await queryModel
      .find({}, { "conversation._id": 0, _id: 0 })
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(`RaisedQuery by  ${raisedQueries} : `);
    if (raisedQueries) {
      response.status(StatusCodes.OK).json({
        raisedQueries: raisedQueries,
        message: "These are the recently raised queries ..!",
      });
    } else {
      response.status(StatusCodes.NOT_FOUND).json({
        raisedQueries: null,
        message: "No Query has been raise by the user yet ..!",
      });
    }
  } catch (error) {
    console.log("Error occure in userRaiseQueryController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewStudentListController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const studentList = await userModel
      .find({ roleId: STUDENT_ROLE_ID }, { _id: 0 })
      .select("firstName lastName email contactNumber roleId profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    console.log("StudentList :: ", studentList);

    if (studentList && studentList.length > 0) {
      const result = studentList.map((student) => ({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        contactNumber: student.contactNumber,
        role: "Student",
        profileImg: student.profileImg,
        status: student.status,
      }));

      console.log(result);

      response.status(StatusCodes.OK).json({
        studentList: result,
        message: "These are the registered students!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Student list not found!" });
    }
  } catch (error) {
    console.log("Error occurred in adminViewStudentListController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewSupportAdminListController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const adminList = await userModel
      .find({ roleId: SUPPORT_ADIMIN_ROLE_ID }, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });
    if (adminList && adminList.length > 0) {
      response.status(StatusCodes.OK).json({
        adminList: adminList,
        message: "These are the registered support admins ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Student list not found!" });
    }
  } catch (error) {
    console.log("Error occure in userRaiseQueryController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewUserListController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const userList = await userModel
      .find({}, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (userList && userList.length > 0) {
      response.status(StatusCodes.OK).json({
        userList: userList,
        message: "Registered user fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminViewUserListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminManageStudentStatusController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, action } = request.params;
    console.log("student id : ", email, "  action : ", action);
    if (!email || !action) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Student ID and action are required" });
    }

    const status = action === "true" ? true : action === "false" ? false : null;
    if (status === null) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid action. Use true or false." });
    }

    const result = await userModel.updateOne(
      { email: email, roleId: STUDENT_ROLE_ID },
      { $set: { status: action } }
    );
    if (result?.acknowledged) {
      console.log("Student Status updated  successfully ..!");
      response
        .status(StatusCodes.OK)
        .json({ message: "Student Status updated successfully ..!" });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found or _id mismatch" });
    }
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

export const adminAddContactNumberController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, role } = request.payload;
    const { contactNumber } = request.body;
    console.log("Hello from adminAddContactNumberController ..!");
    if (!email || !role) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.updateOne(
        { email, role },
        { $set: { contactNumber: contactNumber } }
      );
      if (result?.acknowledged) {
        console.log("Contact Number added successfully ..!");
        response
          .status(StatusCodes.OK)
          .json({ message: "Contact number updated successfully!" });
      } else {
        response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Something went wrong ..!" });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminRaiseQueryController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, roleName } = request.payload;
    const { subject, message } = request.body;
    if (!subject || !message) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Subject and Message are required  ..!" });
    }
    const similaryExistingQuery = await queryModel.findOne({
      userEmail: email,
      userRole: roleName,
      subject,
      message,
    });
    if (!similaryExistingQuery) {
      const queryId = await generateUniqueId("query", email, roleName);
      const updatedQuery = await queryModel.create({
        queryId: queryId,
        userEmail: email,
        userRole: roleName,
        subject,
        message,
        conversation: [
          {
            sender: name,
            email: email,
            message: message,
            role: roleName,
            timestamp: new Date(),
          },
        ],
      });
      if (updatedQuery)
        response
          .status(StatusCodes.OK)
          .json({ message: "Your query has been successfully added ..!" });
    } else {
      response
        .status(StatusCodes.ALREADY_EXIST)
        .json({ message: "A similar query has already been added by you ..!" });
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create query" });
  }
};

export const adminResponseController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, roleName } = request.payload;
    const { queryId } = request.params;
    const { message } = request.body;
    console.log("QueryId : ", queryId);

    const query = await queryModel.findOne({ queryId: queryId });
    console.log("Got Query ==> ", query?.status);
    if (!query) {
      response.status(StatusCodes.NOT_FOUND).json({ error: "Query not found" });
    } else if (query.status !== "Closed") {
      console.log("Name ==> ", request.payload.name);
      console.log("Email ==> ", request.payload.email);
      console.log("Query ", query);
      query.conversation.push({
        sender: name,
        email: email,
        message,
        role: roleName,
        timestamp: new Date(),
      });
      await query.save();
      console.log("After conversation.push:", query.conversation);
      response.status(StatusCodes.CREATED).json({
        message: "Your response has been sent to the Inquirer successfully!",
      });
    } else {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query has been closed by the user!" });
    }
    console.log("Query in adminResponseController : ", query);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to find query" });
  }
};

export const adminManageQueryStatusController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { queryId, status } = request.params;
    console.log("query id : ", queryId, status);
    if (!queryId || !status) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query ID and status are required" });
    }

    const result = await queryModel.updateOne(
      { queryId: queryId },
      { $set: { status: status } }
    );

    if (result?.acknowledged) {
      console.log("Query status updated successfully");
      response
        .status(StatusCodes.CREATED)
        .json({ message: "Query status updated to Closed successfully ..!" });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Something went wrong ..!" });
    }
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to find query" });
  }
};

export const adminAuthenticationController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
    const result = await userModel.findOne({
      email: payload.email,
      role: payload.roleName,
    });
    const adminData = {
      name: result?.firstName + " " + result?.lastName,
      email: result?.email,
      contactNumber: result?.contactNumber,
      role: payload?.roleName,
      profileImg: result?.profileImg,
    };
    if (result?.status) {
      response.status(StatusCodes.OK).json({
        userData: adminData,
        token: token,
        message: "Authenntication Successfull ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Something went wrong ..!" });
    }
  } catch (err) {
    console.log("Error while user authentication Controller", err);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

export const adminGetQueryDataController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { queryId } = request.params;
    const queryData = await queryModel.findOne(
      { queryId: queryId },
      { "conversation._id": 0, _id: 0 }
    );
    if (queryData) {
      response
        .status(StatusCodes.OK)
        .json({ queryData: queryData, message: "Query has been f ..!" });
    } else {
      response.status(StatusCodes.NOT_FOUND).json({
        queryData: null,
        message: "Query Not found with this Id  ..!",
      });
    }
  } catch (err) {
    console.log("Error while user authentication Controller", err);
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

export const adminAddNewRoleController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { userRole, access } = request.body;
    const roleId = await generateUniqueId("role");
    const data = {
      roleId,
      roleName: userRole,
      access,
      createdBy: email,
      updatedBy: email,
      creatorRole: roleName,
      updaterRole: roleName,
    };
    console.log("data ", data);

    const newRole = await roleModel.create(data);
    if (newRole) {
      response.status(StatusCodes.CREATED).json({
        message: "Role Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.error("Error in adminManageRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const getRoleByUserIdController = async (
  request: express.Request,
  response: express.Response
) => {
  const { userId } = request.params;
  try {
    const user = await userModel.findOne({ userId: userId });
    if (!user) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    response.status(200).json({ data: user.roleId, message: "Role of given userId : " });
  } catch (error) {
    console.log("Error occured in getRoleByUserId : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getRoleByIdController = async (
  request: express.Request,
  response: express.Response
) => {
  const { roleId } = request.params;
  try {
    const role = await roleModel.findOne({ roleId: roleId });
    if (!role) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role not found" });
    }
    response.status(200).json({ data: role, message: "Role of given roleId : " });
  } catch (error) {
    console.log("Error occured in getRoleById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetAllRolesController = async (
  request: any,
  response: express.Response
) => {
  try {
    const roleList = await roleModel
      .find({}, { _id: 0 })
      .select("roleId roleName access")
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(roleList);

    if (roleList && roleList.length > 0) {
      response.status(StatusCodes.OK).json({
        roleList: roleList,
        message: "Roles fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllRolesController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewStatusController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { statusName } = request.body;
    const statusId = await generateUniqueId("status");
    const data = {
      statusId,
      statusName,
      createdBy: email,
      updatedBy: email,
      creatorRole: roleName,
      updaterRole: roleName,
    };
    console.log("data ", data);

    const newStatus = await statusModel.create(data);
    if (newStatus) {
      response.status(StatusCodes.CREATED).json({
        message: "Status Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.error("Error in adminAddNewStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const adminAddNewBatchController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    const { batchName, startDate, endDate, trainerId, courseId, students } =
      request.body;
    const batchId = await generateUniqueId("batch");
    const data = {
      batchId,
      courseId: courseId,
      trainerId: trainerId,
      batchName: batchName,
      startDate: startDate,
      students: students,
      endDate: endDate,
      createdBy: email,
      updatedBy: email,
      creatorRole: roleName,
      updaterRole: roleName,
    };
    console.log(data);
    const newBatch = await batchModel.create(data);
    if (newBatch) {
      response.status(StatusCodes.CREATED).json({
        message: "Batch Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.log("Error occure in adminAddNewBatchController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetAllBatchController = async (
  request: any,
  response: express.Response
) => {
  try {
    const batchList = await batchModel
      .find({}, { _id: 0 })
      .select("batchId batchName courseId trainerId startDate endDate")
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(batchList);

    if (batchList && batchList.length > 0) {
      response.status(StatusCodes.OK).json({
        batchList: batchList,
        message: "Batches fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Batch list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllBatchController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getBatchByIdController = async (
  request: express.Request,
  response: express.Response
) => {
  const { batchId } = request.params;
  try {
    const batch = await batchModel.findOne(
      { batchId: batchId },
      { "students._id": 0, _id: 0 }
    );
    console.log(batch);

    if (!batch) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Batch not found" });
    }
    console.log(batch);

    response.status(200).json({ data: batch, message: "Batch of given id" });
  } catch (error) {
    console.log("Error occured in getBatchById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewCourseController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    const { courseName, courseCategory, courseFees, courseDescription } =
      request.body;
    const courseId = await generateUniqueId("course");
    const data = {
      courseId,
      courseName: courseName,
      courseCategory: courseCategory,
      courseFees: courseFees,
      courseDescription: courseDescription,
      createdBy: email,
      updatedBy: email,
      creatorRole: roleName,
      updaterRole: roleName,
    };
    console.log(data);
    const newCourse = await courseModel.create(data);
    if (newCourse) {
      response.status(StatusCodes.CREATED).json({
        message: "Course Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.log("Error occure in adminAddNewCourseController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetAllCourseController = async (
  request: any,
  response: express.Response
) => {
  try {
    const courseList = await courseModel
      .find({}, { _id: 0 })
      .select("courseName courseCategory courseFees courseDescription ")
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(courseList);

    if (courseList && courseList.length > 0) {
      response.status(StatusCodes.OK).json({
        courseList: courseList,
        message: "Courses fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllCourseController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getCourseByIdController = async (
  request: express.Request,
  response: express.Response
) => {
  const { courseId } = request.params;
  try {
    const course = await courseModel.findOne({ courseId: courseId });
    if (!course) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course not found" });
    }
    response.status(200).json({ data: course, message: "Course of given id" });
  } catch (error) {
    console.log("Error occured in getCourseById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminRegisterEmployeesController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, contactNumber, roleId } = request.body;
    const [firstName, lastName] = name.split(" ");
    const userId = await generateUniqueId("user");

    const userData = await userModel.create({
      userId,
      email,
      firstName,
      lastName,
      status: true,
      roleId:
        roleId === COUNSELLOR_ROLE_ID
          ? COUNSELLOR_ROLE_ID
          : roleId === TRAINER_ROLE_ID
            ? TRAINER_ROLE_ID
            : SUPPORT_ADIMIN_ROLE_ID,
      contactNumber,
    });

    if (userData) {
      const employeeId = await generateUniqueId("employee");
      const employeeData = await employeeModel.create({
        employeeId,
        userId: userData.userId,
        createdBy: request.payload.email,
        updatedBy: request.payload.email,
        creatorRole: request.payload.roleName,
        updaterRole: request.payload.roleName,
      });
      if (employeeData) {
        response.status(StatusCodes.CREATED).json({
          message: "Employee registered successfully",
        });
      } else {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Employee not registered Something Went Wrong ..!",
        });
      }
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Employee not registered Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.log("Error occured in addNewLeads : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminManageUsersAccessRightsController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { email, roleName } = request.payload;
    const { userId, roleId, permissions } = request.body;
    if (!userId || !roleId || !(permissions.length > 0)) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please fill up all the required fields ..! " });
    } else {
      const accessRight = await AccessRights.create({
        userId,
        roleId,
        permissions,
        createdBy: email,
        updatedBy: email,
        creatorRole: roleName,
        updaterRole: roleName,
      });
      response.status(StatusCodes.CREATED).json({
        message: "Access rights assigned successfully",
        data: accessRight,
      });
    }
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong" });
  }
}

export const adminGetAllTransactionsController = async (request: any, response: express.Response) => {
  try {
    const payments = await paymentModel.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderDetails'
        }
      },
      { $unwind: '$orderDetails' },
      {
        $project: {
          _id: 0,
          paymentId: 1,
          orderId: 1,
          emiDetails: 1,
          'orderDetails.coursesPurchased': 1,
          'orderDetails.finalAmount': 1,
          'orderDetails.discount': 1,
          createdBy: 1,
          updatedBy: 1,
          creatorRole: 1,
          updaterRole: 1
        }
      }
    ]);

    console.log(payments)

    // const orderDetails = await orderModel.findOne({ orderId: payments[0].orderId })
    //   .populate({
    //     path: 'userId',
    //     model: 'User',
    //     select: 'name email contactNumber'
    //   })
    //   .populate({
    //     path: 'transactionId',
    //     model: 'Transaction',
    //     select: 'transactionAmount paymentMode paymentType transactionDate'
    //   });

    // // Check if the order was found
    // if (!orderDetails) {
    //   return response.status(StatusCodes.NOT_FOUND).json({
    //     success: false,
    //     message: 'Order not found for the given orderId',
    //   });
    // }

    // console.log(orderDetails);

    // Return the populated order details, user details, and transaction details
    // response.status(200).json({
    //   success: true,
    //   data: orderDetails,
    // });
    console.log(payments[0].orderId);
    console.log(payments[0]['orderDetails'])
    response.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: 'Error fetching payment details', error });
  }
};

export const adminAuthenticateJWT = async (
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
    const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired Candidate token" });
  }
};
