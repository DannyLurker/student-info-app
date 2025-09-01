const unhandledRejection = () => {
  process.on("unhandledRejection", (reason: unknown) => {
    console.log("UNHANDLED REJECTION! Shutting down");
    if (reason instanceof Error) {
      console.log(reason.name, reason.message);
    } else {
      console.log("Unhandled rejection reason:", reason);
    }
  });
};

export default unhandledRejection;
