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
import { staffLoginLogic, studentLoginLogic } from "../services/auth/login.js";
import {
  staffForgetPassword,
  studentForgetPassword,
} from "../services/auth/forgetPassword.js";
import {
  staffResetPasswordAccount,
  studentRestPasswordAccount,
} from "../services/auth/resetPassword.js";

const router = express.Router();

//Auth Routes

// Signup Routes
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

// Login Routes
router.post("/student-login", studentLoginLogic);
router.post("/staff-login", staffLoginLogic);

// forget Password
router.post("/student-forget-password", studentForgetPassword);
router.post("/staff-forget-password", staffForgetPassword);

// Reset Password
router.post("/student-reset-password/:id", studentRestPasswordAccount);
router.post("/staff-reset-password/:id", staffResetPasswordAccount);

export default router;
