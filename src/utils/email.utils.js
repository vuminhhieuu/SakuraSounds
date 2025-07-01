const nodemailer = require('nodemailer')

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`

  const mailOptions = {
    from: `"SakuraSounds" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email - SakuraSounds',
    html: `
      <h1>Welcome to SakuraSounds!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    `
  }

  await transporter.sendMail(mailOptions)
}

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`

  const mailOptions = {
    from: `"SakuraSounds" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - SakuraSounds',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
} 