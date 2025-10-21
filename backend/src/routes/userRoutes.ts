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
import {
  staffResendEmail,
  studentResendEmail,
} from "../services/auth/resendEmail.js";
import { staffLogout, studentLogout } from "../services/auth/logout.js";

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
  restrictTo("admin", "principal"),
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

// Resend Email
router.post("/student-resend-email/:id", studentResendEmail);
router.post("/staff-resend-email/:id", staffResendEmail);

// Logout Email
router.post("/student-logout", studentLogout);
router.post("/staff-logout", staffLogout);

export default router;
