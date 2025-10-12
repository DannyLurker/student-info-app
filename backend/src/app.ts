import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import AppError from "./utils/error/appError.js";
import globalErrorHandler from "./utils/error/globalErrorHandler.js";
import { Request, Response, NextFunction } from "express";
import { getDirname } from "./utils/path/pathUtils.js";
import router from "./routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const userRouter = router;

const __dirname = getDirname(import.meta.url);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));

// Pastikan req.query writable sebelum express-mongo-sanitize
app.use((req: Request, _res: Response, next: NextFunction) => {
  try {
    const q = req.query;
    Object.defineProperty(req, "query", {
      value: q ? { ...q } : {},
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch (err) {
    // jika gagal, lanjut saja — sanitize mungkin masih aman
  }
  next();
});

app.use(mongoSanitize());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/users", userRouter);

// Uncaught rotues
app.all("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
