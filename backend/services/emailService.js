import dotenv from "dotenv";
dotenv.config();

// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Missing");


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to AI Career Coach!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to AI Career Coach, ${name}!</h1>
        <p>We're excited to help you accelerate your career journey.</p>
        <h2>Getting Started:</h2>
        <ul>
          <li>Upload your resume for AI analysis</li>
          <li>Take a mock interview</li>
          <li>Get personalized career roadmap</li>
          <li>Practice coding problems</li>
        </ul>
        <p>Start your journey today and land your dream job!</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

export const sendInterviewReport = async (email, name, interviewData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Interview Performance Report',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Interview Performance Report</h1>
        <p>Hello ${name},</p>
        <p>Here's your interview performance summary:</p>
        <ul>
          <li>Overall Score: ${interviewData.overallScore}%</li>
          <li>Communication Score: ${interviewData.communicationScore}%</li>
          <li>Technical Score: ${interviewData.technicalScore}%</li>
          <li>Confidence Score: ${interviewData.confidenceScore}%</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/report" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Report</a>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};