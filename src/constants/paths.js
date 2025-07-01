/**
 * Express router paths go here.
 */
const PathAPI = {
  Empty: '/',
  Base: '/api/v1',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Register: '/register',
    ForgotPassword: '/forgot-password',
    ResetPassword: '/reset-password',
    VerifyEmail: '/verify-email',
  },
  User: {
    Base: '/user',
    Profile: '/profile',
    UpdateProfile: '/update',
    ChangePassword: '/change-password',
    DeleteAccount: '/delete',
  },
  Profile: {
    Base: '/profile',
    Update: '/update',
    ChangePassword: '/change-password',
    UploadAvatar: '/avatar',
    DeleteAccount: '/delete',
    Playlists: '/playlists',
    Favorites: '/favorites',
  },
  Artist: {
    Base: '/artists',
  },
  Song: {
    Base: '/songs',
  },
  Album: {
    Base: '/albums',
  },
  Playlist: {
    Base: '/playlists',
  },
}

const PathUI = {
  Auth: {
    Login: 'auth/login',
    Register: 'auth/register',
    ForgotPassword: 'auth/forgot-password',
    ResetPassword: 'auth/reset-password',
  },
  User: {
    Profile: 'user/profile',
  },
  Home: 'pages/home',
}

module.exports = {
  PathAPI,
  PathUI,
}
