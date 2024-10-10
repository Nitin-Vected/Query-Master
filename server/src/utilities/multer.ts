import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(__dirname, "../uploads");

const createStorage = (subfolder: string) => {
  return multer.diskStorage({
    destination: (request, file, cb) => {
      const folderPath = path.join(uploadPath, subfolder);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    },
    filename: (request, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

export const uploadTransactionProof = multer({
  storage: createStorage("transactionProofs"),
}).single("transactionProof");

export const uploadImages = multer({
  storage: createStorage("images"),
}).single("transactionProof");

export const uploadDocuments = multer({
  storage: createStorage("documents"),
}).single("transactionProof");
