import { toObjectId } from "./toObjectId.js";
import bcrypt from "bcryptjs";

export const excelHandlers = {
  student: async (data: any, salt: string) => ({
    role: "student",
    username: data.username,
    email: data.email,
    password: await bcrypt.hash(data.password, salt),
    grade: data.grade,
    homeroomTeacher: toObjectId(data.homeroomTeacher),
    major: data.major,
  }),

  staff: async (data: any, salt: string) => {
    let subjects = [],
      grades = [],
      homeroom = null;
    try {
      if (data.teachingSubjects) {
        subjects = JSON.parse(data.teachingSubjects).map((s: string) =>
          s.toLowerCase().trim()
        );
      }
      if (data.teachingGrades) grades = JSON.parse(data.teachingGrades);
      if (data.homeroomClass) homeroom = JSON.parse(data.homeroomClass);
    } catch (err) {
      console.error("JSON parse error:", err);
    }

    return {
      role: "teacher",
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, salt),
      teachingSubjects: subjects,
      homeroomClass: homeroom,
      teachingGrades: grades,
    };
  },
};
