import nodemailer from "nodemailer";

// Configure email transport (Make sure to use real SMTP credentials)
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send general email utility function
export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // Ensure this URL matches your frontend route

  const subject = "Password Reset Request";
  const text = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail(to, subject, text); // Reusing the generic sendEmail function
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
