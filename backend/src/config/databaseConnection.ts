import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING as string)
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err: unknown) => {
      // Lebih aman menggunakan unknown daripada object
      // Di TypeScript, properti err di blok catch secara default memiliki tipe unknown. Anda tidak dapat melakukan operasi apa pun pada nilai unknown sampai Anda melakukan pemeriksaan tipe (type check) atau assertion yang ketat. Ini memaksa Anda untuk menulis kode yang lebih aman.
      if (err instanceof Error) {
        // Mengecek apakah err adalah instance dari Error
        console.log(`Error: ${err.message}`);
      } else {
        console.log("An unknown error occurred:", err);
      }
    });
};

export default databaseConnection;
