# SakuraSounds 🎵

SakuraSounds is a web-based music streaming application built using the **MVC architecture** with **Node.js**, **Express**, and **MongoDB**. The goal of this project is to provide users with an intuitive and seamless music experience where they can listen to their favorite songs, create playlists, and manage their music library.

## Features ✨

- **User Authentication**: Sign up, login, and manage user accounts.
- **Playlist Management**: Create, edit, and delete personalized playlists.
- **Song Streaming**: Play songs directly from the platform.
- **Search Functionality**: Search for songs by title, artist, or genre.
- **Responsive Design**: Designed with a clean and responsive interface using **SCSS** and **EJS view engine**.

## Tech Stack 🛠️

- **Backend**: Node.js, Express.js
- **Frontend**: EJS for templating, SCSS for styling
- **Database**: MongoDB with Mongoose for ORM
- **Authentication**: JSON Web Tokens (JWT)
- **CSS Preprocessor**: SCSS

## Project Structure 🗂️

```plaintext
src/
├── config/             # Configuration files (database, environment)
├── controllers/        # Controller logic to handle routes
├── models/             # Database schemas (User, Song, Playlist)
├── public/             # Static files (CSS, JS, images)
├── routes/             # API and view routes
├── services/           # Business logic and service layers
├── uploads/            # Folder for uploaded content (if needed)
├── utils/              # Helper functions and utilities
├── views/              # EJS templates for rendering HTML pages
└── server.js           # Main server file
```

## Getting Started 🚀

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (local or cloud instance)
- **Git** (for version control)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vuminhhieuu/SakuraSounds.git
   cd SakuraSounds
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   PORT=3000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Run the application**:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. **Access the app**: Open your browser and navigate to `http://localhost:3000`.

### File `.env` Example:
```plaintext
PORT=3000
MONGO_URI=mongodb://localhost:27017/sakura_sounds
JWT_SECRET=supersecretkey
```

## Usage 🖥️

1. **Sign up** for an account.
2. **Log in** with your credentials to access the dashboard.
3. **Search** for your favorite songs and artists.
4. Create **playlists** and manage your music library.

## Contributing 🤝

We welcome contributions! Please fork the repository, create a branch, and submit a pull request.

### Steps to Contribute

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add a new feature'`)
4. Push to your branch (`git push origin feature/new-feature`)
5. Open a pull request

## Learn More 📚

Here are some useful resources to get familiar with the tech stack:
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [EJS Documentation](https://ejs.co/)

---

Let me know if you'd like any modifications or additions!