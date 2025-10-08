import express from "express";
import {
  manualStudentSignupLogic,
  excelStudentSignupLogic,
} from "../services/auth/Signup.js";
import upload from "../middleware/multer.js";

const router = express.Router();

//Auth Routes
router.post("/signup", manualStudentSignupLogic);
router.post(
  "/signup-with-excel",
  upload.single("excelFile"),
  excelStudentSignupLogic
);

export default router;
