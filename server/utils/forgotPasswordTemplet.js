export const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #2c3e50;">Hi ${name},</h2>
      <p style="font-size: 16px;">We received a request to reset your password.</p>
      <p style="font-size: 16px;">Your OTP is:</p>
      <div style="background-color: #eaf3fc; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #007BFF;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>30 minutes</strong>.</p>
      <p style="font-size: 14px;">If you didn't request this, please ignore this email.</p>
      <br />
      <p style="font-size: 16px;">Thank you!</p>
      <p style="font-size: 16px; font-weight: bold;">– Apna Shop Team</p>
    </div>
  `;
}
