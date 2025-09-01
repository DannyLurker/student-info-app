const uncaughtException = () => {
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Shutting down");
    //err.name dan err.message properti bawaan dari objek Error di JavaScript
    console.log(err.name, err.message);
    process.exit(1);
  });
};

export default uncaughtException;
