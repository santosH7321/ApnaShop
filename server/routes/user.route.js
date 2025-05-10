import Router from "express";
import { forgotPasswordController, loginController, logoutController, registerUserController, resetPassword, updateUserDetails, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";


const userRouter = Router();

userRouter.post("/register", registerUserController)
userRouter.post("/verify-email", verifyEmailController)
userRouter.post("/login", loginController)
userRouter.get("/logout",auth, logoutController)
userRouter.put("/upload-avatar", auth,upload.single("avatar"), uploadAvatar)
userRouter.put("/update-user", auth, updateUserDetails)
userRouter.post("/forgot-password", forgotPasswordController)
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp)
userRouter.post("/reset-password", resetPassword)

export default userRouter;