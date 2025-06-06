import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import { generatedAccessToken } from "../utils/generatedAccessToken.js";
import { generatedRefreshToken } from "../utils/generatedRefreshToken.js";
import uploadImageCloudnary from "../utils/uploadImageCloudnary.js";
import { generateOtp } from "../utils/generatedOtp.js";
import { forgotPasswordTemplate } from "../utils/forgotPasswordTemplet.js";
import jwt from "jsonwebtoken";

// signup route 
export const registerUserController = async (request, response) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return response.json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from ApnaShop",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return response.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
// Email varification link
export const verifyEmailController = async (request, response) => {
  try {
    const { code } = request.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return response.status(400).json({
        message: "Invalide Code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.json({
      message: "Email verification is done ✅",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
};

// Login Controller
export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;

    if(!email || !password) {
      return response.status(400).json({
        message: "provide invalide credintials",
        error: true,
        success: false
      })
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", accesstoken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.json({
      message: "Login successfully",
      success: true,
      error: false,
      data: {
        accesstoken,
        refreshToken
      }
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// Logout Controllers
export const logoutController = async(request, response) => {
  try {
    const userid = request.userId // middleware


    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.clearCookie("accessToken", cookiesOption)
    response.clearCookie("refreshToken", cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token : ""
    })
    return response.json({
      message: "Logout succefully",
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// upload user avatar

export const uploadAvatar = async(request, response) => {
  try {
    const userId = request.userId // auth middleware
    const image = request.file // multer middleware
    const upload = await uploadImageCloudnary(image);


    const upadateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url
    })
    return response.json({
      message: "upload profile",
      data: {
        _id: userId,
        avatar: upload.url
      }
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// upadate user details

export const updateUserDetails = async(request, response) => {
  try {
    const userId = request.userId // auth middleware
    const { name, email, mobile, password } = request.body

    let hashPassword = ""
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    } 
    
    const updateUser = await UserModel.updateOne({ _id: userId}, {
      ...(name && { name: name}),
      ...(email && { email: email}),
      ...(mobile && { mobile: mobile}),
      ...(password && { password: hashPassword})
    })

    return response.json({
      message: "Updated user successfully",
      error: false,
      success: true,
      data: updateUser
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// Forgot Password

export const forgotPasswordController = async(request, response) => {
  try {
    const { email } = request.body

    if (!email) {
      return response.status(400).json({
        message: "Provide email",
        error: true,
        success: false
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return response.status(400).json({
        message: "Invalide email",
        error: true,
        success: false
      })
    }

    const otp = generateOtp()
    const expireTime = Date.now() + 30 * 60 * 1000 // 30 min

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expire: new Date(expireTime).toISOString()
    })

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from ApnaShop",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    })

    return response.json({
      message: "Forgot otp send to your email",
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// verify forgot password otp
export const verifyForgotPasswordOtp = async(request, response) => {
  try {
    const { email, otp } = request.body
    
    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp.",
        error: true,
        success: false
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return response.status(400).json({
        message: "Invalide user",
        error: true,
        success: false
      })
    }



    const currentTime = new Date().toISOString()
    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "Otp expired",
        error: true,
        success: false
      })
    }

    if(otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "Invalide otp",
        error: true,
        success: false
      })
    }

    // if otp is not expired
    // otp === user.forgot_password_otp
    return response.json({
      message: "Otp verified successfully",
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// reset the password

export const resetPassword = async(request, response) => {
  try {
    const { email, newPassword, confirmPassword } = request.body

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Provide required field email, newPassword, confirmPassword",
        error: true,
        success: false
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return response.status(400).json({
        message: "Email is not available",
        error: true,
        success: false
      })
    }

    if(newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "Password not match",
        error: true,
        success: false
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    })

    return response.json({
      message: "Password updated successfully",
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// refresh token controller

export const refreshTokenController = async(request, response) => {
  try {
    const { refreshToken } = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1]
    
    if (!refreshToken) {
      return response.status(400).json({
        message: "Refresh token not found",
        error: true,
        success: false
      })
    }

    const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
    if (!verifyToken) {
      return response.status(400).json({
        message: "Invalide refresh token",
        error: true,
        success: false
      })
    }
    

    const userId = verifyToken?._id
    const newAccesstoken = await generatedAccessToken(userId)
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }
    response.cookie("accessToken", newAccesstoken, cookiesOption)

    return response.json({
      message: "New access token generated",
      error: false,
      success: true,
      data: {
        "accessToken": newAccesstoken
      }
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}