import app from "./app.js";
import uncaughtException from "./config/uncaughtException.js";
import databaseConnection from "./config/databaseConnection.js";
import unhandledRejection from "./config/unhandledRejection.js";

uncaughtException();

unhandledRejection();

databaseConnection();

app.listen(process.env.PORT, () => {
  console.log(`App running on localhost:${process.env.PORT}`);
});
