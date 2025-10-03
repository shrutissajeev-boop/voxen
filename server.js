const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("./config/db");          // DB connection + createTables
require("./config/passport");    // Passport config

const routes = require("./routes/index");


// Middleware
app.use(cors({
  origin: "http://localhost:5500",
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", routes);
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`- POST /api/auth/register - User registration`);
    console.log(`- POST /api/auth/login - User login`);
    console.log(`- GET /api/auth/profile - User profile (protected)`);
    console.log(`- GET /api/chat/... - Chat routes`);
    console.log(`- GET /api/users/... - User routes`);
    console.log(`- POST /api/auth/logout - Logout`);
    console.log(`- GET /api/auth/google - Google OAuth`);

});