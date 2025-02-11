const nodemailer = require("nodemailer");
const emailPart1 = `
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">Your One-Time Password</h2>
                        <p style="color: #777; font-size: 16px; margin-top: 10px;"> This OTP is valid for <b>10 minutes</b> only.</p>
                        <p style="color: #777; font-size: 14px;"> Do <b>not</b> share this OTP with anyone for security reasons.</p>
                        <p style="font-size: 28px; font-weight: bold; color:rgb(0, 0, 0); background:rgb(240, 239, 240); padding: 10px; border-radius: 5px; display: inline-block;">
            
            `;
const emailPart2 = `</p>
                        <p style="color: #777; font-size: 14px;">🔄 If you face any issues, please try again after 10 minutes.</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #aaa; font-size: 12px;">This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `;
            

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Verification (Valid for 10 Minutes)",
      html: `${emailPart1} ${otp} ${emailPart2}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Failed to send OTP");
  }
};

module.exports = sendOTP;
