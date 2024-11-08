/**
 * Express router paths go here.
 */
const PathAPI = {
  Empty: '/',
  Base: '/api/v1',
  User: {
    Base: '/user',
    Signup: '/signup',
    Signin: '/signin',
    Signout: '/signout',
    ForgotPassword: '/forgot-password',
    ResetPassword: '/reset-password',
  },
}

const PathUI = {
  SigninPage: 'pages/auth/signin',
  SignupPage: 'pages/auth/signup',
  ForgotPasswordPage: 'pages/auth/forgot_password',
  ResetPasswordPage: 'pages/auth/reset_password',
  HomePage: 'pages/home',
}

module.exports = {
  PathAPI,
  PathUI,
}
