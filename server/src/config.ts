import dotenv from "dotenv";
import queryModel from "./model/queryModel";
import courseModel from "./model/courseModel";
import shortid from 'shortid';
import roleModel from "./model/roleModel";
import userModel from "./model/userModel";
import batchModel from "./model/batchModel";
dotenv.config();

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING as string;
export const PORT: string = process.env.PORT as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
export const COUNCILOR_SECRET_KEY: string = process.env.COUNCILOR_SECRET_KEY as string;
export const GOOGLE_DECODE_TOKEN_API: string = process.env.GOOGLE_DECODE_TOKEN_API as string;
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

export const generateUniqueId = async (mode: string, email?: string, role?: string) => {
    try {
        console.log('mode ==> ', mode)
        let isUnique = false;
        let newUniqueId = '';
        switch (mode) {
            case 'query': {
                const latestQuery = await queryModel.findOne({ userEmail: email, userRole: role }).sort({ createdAt: -1 }).limit(1);
                console.log("Latest Query ---> ", latestQuery);
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
                console.log("Latest Role ---> ", latestRole);
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
                console.log("Latest Role ---> ", latestCourse);
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
                console.log("Latest User ---> ", latestUser);
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
                    console.log(`Generated Course ID: ${newUniqueId}`);

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
                console.log("Latest Batch ---> ", latestBatch);
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
                    // console.log(`Generated Batch ID: ${newUniqueId}`);

                    const existingBatchWithSameId = await batchModel.findOne({ batchId: newUniqueId });
                    if (!existingBatchWithSameId) {
                        isUnique = true;
                    } else {
                        console.log('User ID collision, regenerating...');
                    }
                }
                return newUniqueId;
            }
        }

    } catch (error) {
        console.error('Error generating Query ID:', error);
        throw error;
    }
}