import multer from "multer";
import path from "path";
const uploadPath = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploadTransactionProof = multer({ storage: storage });
