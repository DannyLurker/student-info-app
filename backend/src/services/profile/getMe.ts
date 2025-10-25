import catchAsync from "express-async-handler";

const getUserProfile = catchAsync(async (req, res, next) => {
  const user = (req as any).user;

  res.status(200).json({
    status: "success",
    message: "Sucessfully retrieved user data",
    data: {
      user,
    },
  });
});

export default getUserProfile;
