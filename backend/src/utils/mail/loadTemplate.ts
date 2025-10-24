import fs from "fs";
import { getDirname } from "../path/pathUtils.js";
import path from "path";
import AppError from "../error/appError.js";
import hbs from "hbs";

const __dirname = getDirname(import.meta.url);

type Replacements = {
  title: string;
  username: string;
  message: string;
  otp: string;
  time: string;
};

const loadTemplate = (
  templateName: string,
  replacements: Replacements
): string => {
  const templatePath = path.join(__dirname, templateName);

  if (!fs.existsSync(templatePath)) {
    throw new AppError(`Template file not found: ${templatePath}`, 404);
  }

  const source = fs.readFileSync(templatePath, "utf-8");

  const template = hbs.handlebars.compile(source);

  return template(replacements);
};

export default loadTemplate;
