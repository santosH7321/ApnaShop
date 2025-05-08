const verifyEmailTemplate = ({ name, url }) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #2c3e50;">Welcome to ApnaShop, ${name} 👋</h2>
          <p>Thank you for registering on <strong>ApnaShop</strong>. To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
              ✅ Verify Your Email
            </a>
          </div>
  
          <p>If you didn’t create an account, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 14px; color: #888;">– The ApnaShop Team</p>
        </div>
      </div>
    `;
  };
  
  export default verifyEmailTemplate;
  