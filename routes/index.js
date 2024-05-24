const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const db = require("../database");

// Render home page
router.get("/", (req, res) => {
  res.render("index");
});

// Render registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const id = Date.now().toString();
    db.run(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [id, req.body.username, hashedPassword],
      (err) => {
        if (err) {
          return res.redirect("/register");
        }
        res.redirect("/login");
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.redirect("/register");
  }
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login
router.post("/login", async (req, res) => {
  try {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [req.body.username],
      async (err, user) => {
        if (
          err ||
          !user ||
          !(await bcrypt.compare(req.body.password, user.password))
        ) {
          return res.redirect("/login");
        }
        req.session.userId = user.id;
        res.redirect("/dashboard");
      }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    res.redirect("/login");
  }
});

// Render dashboard (protected)
router.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [req.session.userId],
      (err, user) => {
        if (err || !user) {
          return res.redirect("/login");
        }
        res.render("dashboard", { user });
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Render profile page (protected)
router.get("/profile", (req, res) => {
  if (req.session.userId) {
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [req.session.userId],
      (err, user) => {
        if (err || !user) {
          return res.redirect("/login");
        }
        res.render("profile", { user });
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Render settings page (protected)
router.get("/settings", (req, res) => {
  if (req.session.userId) {
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [req.session.userId],
      (err, user) => {
        if (err || !user) {
          return res.redirect("/login");
        }
        res.render("settings", { user });
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Fetch dynamic content
router.get("/data", (req, res) => {
  res.sendFile(path.join(__dirname, "../data/data.json"));
});

// Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = (db, bcrypt) => router;
