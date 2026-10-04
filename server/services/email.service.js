import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  async sendOTP(toEmail, otp) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Mock Email] Would have sent OTP ${otp} to ${toEmail}`);
      return;
    }

    const mailOptions = {
      from: `"UIU RideShare" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your Password Reset OTP - UIU RideShare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4beb9; border-radius: 10px;">
          <h2 style="color: #b7131a; text-align: center;">UIU RideShare</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Use the following One-Time Password (OTP) to proceed. This OTP is valid for 10 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 15px 30px; border-radius: 8px;">${otp}</span>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">© ${new Date().getFullYear()} UIU RideShare. Exclusive for UIU Students.</p>
        </div>
      `,
    };

    return transporter.sendMail(mailOptions);
  },
};
