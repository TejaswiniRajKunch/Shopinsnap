// routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../db");
const { sendOtpEmail } = require("../utils/email");

require("dotenv").config();

const router = express.Router();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

/* ============================================================
   SEND OTP BEFORE REGISTRATION
============================================================ */
router.post("/send-otp", async (req, res) => {
  try {
    const { email_id } = req.body;

    if (!email_id) return res.status(400).json({ error: "Email is required" });

    // Check if email is already registered
    const exists = await db.query(
      "SELECT 1 FROM users WHERE email_id = $1",
      [email_id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Insert or update OTP into email_otps table
    await db.query(
      `INSERT INTO email_otps (email_id, otp, otp_expires_at)
       VALUES ($1,$2,$3)
       ON CONFLICT (email_id)
       DO UPDATE SET otp=$2, otp_expires_at=$3`,
      [email_id, otp, expires]
    );

    // Send OTP email
    await sendOtpEmail(email_id, otp);

    console.log(`📧 OTP SENT → ${email_id}: ${otp}`);

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error("ERROR (SEND OTP):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   VERIFY OTP BEFORE REGISTRATION
============================================================ */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email_id, otp } = req.body;

    const { rows } = await db.query(
      "SELECT otp, otp_expires_at FROM email_otps WHERE email_id = $1",
      [email_id]
    );

    if (!rows.length) return res.status(400).json({ error: "OTP not found" });

    const data = rows[0];

    if (otp !== data.otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date() > data.otp_expires_at)
      return res.status(400).json({ error: "OTP expired" });

    console.log(`✅ OTP VERIFIED → ${email_id}`);

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error(" ERROR (VERIFY OTP):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   REGISTER USER (AFTER OTP VERIFIED)
============================================================ */
router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      dob,
      email_id,
      phone_number,
      password,
      role,
    } = req.body;

    console.log(`🔵 REGISTER ATTEMPT → ${email_id}`);

    // Check OTP exists
    const otpCheck = await db.query(
      "SELECT otp FROM email_otps WHERE email_id = $1",
      [email_id]
    );

    if (!otpCheck.rows.length) {
      return res.status(400).json({ error: "Verify email using OTP first" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const q = `
      INSERT INTO users 
      (first_name, last_name, dob, email_id, phone_number, password_hash, role, email_verified)
      VALUES ($1,$2,$3,$4,$5,$6,$7,true)
      RETURNING user_id, first_name, last_name, email_id, phone_number, role, created_at
    `;

    const values = [
      first_name,
      last_name,
      dob,
      email_id,
      phone_number,
      password_hash,
      role || "user",
    ];

    const { rows } = await db.query(q, values);

    // Delete OTP from temp table
    await db.query("DELETE FROM email_otps WHERE email_id = $1", [email_id]);

    console.log(`✅ REGISTER SUCCESS → ${rows[0].user_id}`);

    res.json({ message: "Registration successful!", user: rows[0] });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email or phone already registered" });
    }
    console.error("🔥 ERROR (REGISTER):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   LOGIN USER
============================================================ */
router.post("/login", async (req, res) => {
  try {
    const { email_id, password } = req.body;

    console.log(`🟡 LOGIN ATTEMPT → ${email_id}`);

    const { rows } = await db.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );

    if (!rows.length)
      return res.status(400).json({ error: "Invalid email or password" });

    const user = rows[0];

    if (!user.email_verified)
      return res.status(403).json({ error: "Email not verified" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(400).json({ error: "Invalid email or password" });

    // update last login
    await db.query("UPDATE users SET last_login = NOW() WHERE user_id = $1", [
      user.user_id,
    ]);

    const token = jwt.sign(
      { user_id: user.user_id, email_id: user.email_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log(`✅ LOGIN SUCCESS → ${email_id}`);

    res.json({ 
  message: "Logged in", 
  token,
  role: user.role 
});


  } catch (err) {
    console.error("ERROR (LOGIN):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   GET CURRENT USER
============================================================ */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await db.query(
      `SELECT user_id, first_name, last_name, email_id, phone_number,
              role, is_deleted, email_verified, created_at
       FROM users WHERE user_id = $1`,
      [decoded.user_id]
    );

    res.json({ user: rows[0] });

  } catch (err) {
    console.error("🔥 ERROR (/me):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   SOFT DELETE ACCOUNT
============================================================ */
router.post("/delete-account", async (req, res) => {
  try {
    const user_id = req.body.user_id;

    await db.query(
      "UPDATE users SET is_deleted=true, deleted_at=NOW() WHERE user_id=$1",
      [user_id]
    );

    res.json({ message: "Account deleted. Recover within 15 days." });
  } catch (err) {
    console.error("🔥 ERROR (DELETE ACCOUNT):", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   RECOVER ACCOUNT
============================================================ */
router.post("/recover-account", async (req, res) => {
  try {
    const { email_id } = req.body;

    const { rows } = await db.query(
      "SELECT user_id, deleted_at FROM users WHERE email_id=$1 AND is_deleted=true",
      [email_id]
    );

    if (!rows.length)
      return res.status(400).json({ error: "Account not found" });

    const user = rows[0];

    const daysPassed =
      (new Date() - new Date(user.deleted_at)) /
      (1000 * 60 * 60 * 24);

    if (daysPassed > 15)
      return res.status(400).json({ error: "Recovery window expired" });

    await db.query(
      "UPDATE users SET is_deleted=false, deleted_at=NULL WHERE user_id=$1",
      [user.user_id]
    );

    res.json({ message: "Account recovered successfully" });
  } catch (err) {
    console.error("🔥 ERROR (RECOVER ACCOUNT):", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
