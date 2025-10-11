import express from "express";
import {
  manualStudentSignupLogic,
  excelStudentSignupLogic,
  manualStaffSignupLogic,
  excelStaffSignupLogic,
} from "../services/auth/signup.js";
import upload from "../middleware/multer.js";
import jwtVerify from "../middleware/jwt/jwtVerify.js";
import restrictTo from "../middleware/restrictTo.js";

const router = express.Router();

//Auth Routes
router.post(
  "/student-signup",
  jwtVerify,
  restrictTo("admin", "principal", "teacher"),
  manualStudentSignupLogic
);
router.post(
  "/student-signup-with-excel",
  jwtVerify,
  restrictTo("admin", "principal", "teacher"),
  upload.single("excelFile"),
  excelStudentSignupLogic
);
router.post(
  "/staff-signup",
  jwtVerify,
  restrictTo("admin", "principal"),
  manualStaffSignupLogic
);
router.post(
  "/staff-signup-with-excel",
  upload.single("excelFile"),
  excelStaffSignupLogic
);

export default router;
