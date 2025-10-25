import express from "express";

import upload from "../middleware/multer.js";
import jwtVerify from "../middleware/jwt/jwtVerify.js";
import restrictTo from "../middleware/restrictTo.js";
import { staffLoginLogic, studentLoginLogic } from "../services/auth/login.js";
import {
  staffForgetPasswordLogic,
  studentForgetPasswordLogic,
} from "../services/auth/forgetPassword.js";
import {
  staffResetPasswordAccount,
  studentRestPasswordAccount,
} from "../services/auth/resetPassword.js";
import {
  staffResendEmail,
  studentResendEmail,
} from "../services/auth/resendEmail.js";
import { userLogout } from "../services/auth/logout.js";
import {
  excelStaffSignupLogic,
  excelStudentSignupLogic,
  manualStaffSignupLogic,
  manualStudentSignupLogic,
} from "../services/auth/signup.js";
import getUserProfile from "../services/profile/getMe.js";

const router = express.Router();

// Auth Routes //
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
  jwtVerify,
  restrictTo("admin", "principal"),
  excelStaffSignupLogic
);

// Login Routes
router.post("/student-login", studentLoginLogic);
router.post("/staff-login", staffLoginLogic);

// forget Password
router.post("/student-forget-password", studentForgetPasswordLogic);
router.post("/staff-forget-password", staffForgetPasswordLogic);

// Reset Password
router.post("/student-reset-password", studentRestPasswordAccount);
router.post("/staff-reset-password", staffResetPasswordAccount);

// Resend Email
router.post("/student-resend-email", studentResendEmail);
router.post("/staff-resend-email", staffResendEmail);

// Logout Email
router.post("/user-logout", jwtVerify, userLogout);

// User Profile //
// Get User Profile
router.get("/user-profile", jwtVerify, getUserProfile);

export default router;
