import multer, { FileFilterCallback } from "multer";
import path from "path";
import { IRequest } from "../types/expressTypes.js";
import AppError from "../utils/error/appError.js";

const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];
const ALLOWED_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const storage = multer.memoryStorage();

const customFileFilter = (
  req: IRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isExtensionValid = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isExtensionValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type. Only .xls or .xlsx", 400));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: customFileFilter,
});

export default upload;
