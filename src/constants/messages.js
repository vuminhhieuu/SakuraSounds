const USERS_MESSAGES = {
  SIGNIN: {
    SUCCESS: 'Đăng nhập thành công.',
    UNAUTHORIZED: 'Email hoặc mật khẩu không đúng.',
    ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại.',
    ACCOUNT_NOT_VERIFIED: 'Tài khoản chưa xác thực.',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa.',
  },
  SIGNOUT: {
    SUCCESS: 'Đăng xuất thành công.',
    ERROR: 'Có lỗi xảy ra trong quá trình đăng xuất.',
    NOT_LOGGED_IN: 'Bạn chưa đăng nhập.',
  },
  SIGNUP: {
    SUCCESS: 'Đăng ký tài khoản thành công.',
    EMAIL_EXISTS: 'Email đã tồn tại. Vui lòng sử dụng email khác.',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa.',
  },
  FORGOT_PASSWORD: {
    SUCCESS: 'Mã OTP đã được gửi đến email',
    EMAIL_NOT_FOUND: 'Địa chỉ email không tồn tại.',
  },
  RESET_PASSWORD: {
    SUCCESS: 'Mật khẩu đã được đặt lại thành công.',
    PASSWORD_MISMATCH: 'Các mật khẩu không khớp.',
  },
  OTP: {
    SUCCESS: 'OTP hợp lệ.',
    INVALID: 'OTP không hợp lệ.',
    EXPIRED: 'OTP đã hết hạn. Vui lòng yêu câu lại OTP.',
    NOT_PROVIDED: 'OTP chưa được cung cấp.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
    TOO_MANY_ATTEMPTS:
      'Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu lại OTP.',
  },
  TOKEN: {
    SUCCESS: 'Token hợp lệ.',
    INVALID: 'Token không hợp lệ.',
    EXPIRED: 'Token đã hết hạn.',
    NOT_PROVIDED: 'Token chưa được cung cấp.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  },
}

const SERVERS_MESSAGES = {
  SERVER_ERROR: 'Server error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  NOT_FOUND: 'Not found',
  FORBIDDEN: 'Forbidden',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  UNAUTHORIZED: 'Unauthorized',
  TOO_MANY_REQUESTS: 'Too many requests',
  RATE_LIMITED: 'Rate limited',
  INVALID_TOKEN: 'Invalid token',
  EXPIRED_TOKEN: 'Expired token',
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_INVALID: 'Session invalid',
  SESSION_EXPIRED: 'Session expired',
  SESSION_ALREADY_EXISTS: 'Session already exists',
  SESSION_NOT_ACTIVE: 'Session not active',
}

module.exports = {
  USERS_MESSAGES,
  SERVERS_MESSAGES,
}
