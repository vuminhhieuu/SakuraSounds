require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const validator = require('validator')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE
const SALT_ROUNDS = 10

// Tạo JWT token
const createToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

// Register Service
const register = async (dataUser) => {
    try {
        const { username, email, password } = dataUser
        // Kiểm tra email hợp lệ
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format')
        }
        // Kiểm tra email đã tồn tại hay chưa
        const existingUser = await User.findOne({ email })
        if (existingUser) 
          throw new Error('Email already exists')

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        // Tạo người dùng mới
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()

        return createToken(newUser._id)
    } catch (error) {
        throw new Error(`Registration failed: ${error.message}`)
    }
}

// Login Service
const login = async (dataUser) => {
    try {
        const { email, password } = dataUser
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid email or password')

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) throw new Error('Invalid email or password')

        return createToken(user._id)
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`)
    }
}

// Forgot Password Service
const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error('User not found')

        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '15m',
        })

        // Setup email
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for port 465, false for other ports
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Password Reset',
            text: `Please reset your password by clicking the link: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
        }

        await transporter.sendMail(mailOptions)
        return 'Password reset email sent'
    } catch (error) {
        throw new Error(`Failed to send password reset email: ${error.message}`)
    }
}

// Reset Password Service
const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(decoded.id)
        console.log("Check user >>", user)
        if (!user) throw new Error('Invalid token')

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
        user.password = hashedPassword
        await user.save()

        return 'Password successfully reset'
    } catch (error) {
        throw new Error(`Failed to reset password: ${error.message}`)
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
}
