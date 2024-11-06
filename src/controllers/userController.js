const userService = require('../services/userService')

// Controller cho đăng ký
const register = async (req, res) => {
    try {
        const token = await userService.register(req.body)
        res.status(201).json({ token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


// Controller cho đăng nhập
const login = async (req, res) => {
    try {
        const token = await userService.login(req.body)
        res.status(200).json({ token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Controller cho quên mật khẩu
const forgotPassword = async (req, res) => {
    try {
        const message = await userService.forgotPassword(req.body.email)
        res.status(200).json({ message })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Controller cho đặt lại mật khẩu
const resetPassword = async (req, res) => {
    try {
        const message = await userService.resetPassword(
            req.params.token,
            req.body.newPassword,
        )
        res.status(200).json({ message })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
}
