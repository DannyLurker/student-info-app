import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import AppError from "./utils/error/appError.js";
import globalErrorHandler from "./utils/error/globalErrorHandler.js";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// 📌 Mengonversi import.meta.url menjadi path sistem file yang valid
const __filename = fileURLToPath(import.meta.url);
// ⬆️ `import.meta.url` mengembalikan URL file dalam format `file://...`
// ⬆️ `fileURLToPath(import.meta.url)` mengubahnya menjadi path absolut seperti `C:\Users\User\myProject\src\utils.ts`

// 📌 Mendapatkan direktori tempat file ini berada
const __dirname = path.dirname(__filename);
// ⬆️ `path.dirname(__filename)` mengambil direktori dari path file
// ⬆️ Jika `__filename` adalah `C:\Users\User\myProject\src\utils.ts`, maka `__dirname` adalah `C:\Users\User\myProject\src`

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
app.get("/home", (req: Request, res: Response) => {
  res.json("Hi");
});

// Uncaught rotues
app.all("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
