const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const sqlite3 = require("sqlite3").verbose(); // Import SQLite3
const app = express();

// Initialize SQLite database
const dbPath = path.resolve(__dirname, "data.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    // Create users table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
  }
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);
app.use(express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index")(db, bcrypt);
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
