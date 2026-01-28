// routes/category.js
const express = require("express");
const db = require("../db");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================================
   ADD NEW CATEGORY (ADMIN ONLY)
============================================ */
router.post("/add", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { cat_name } = req.body;

    if (!cat_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const q = `
      INSERT INTO category (cat_name, created_by)
      VALUES ($1, $2)
      RETURNING *
    `;

    const { rows } = await db.query(q, [cat_name, req.user.user_id]);

    res.json({ message: "Category created", category: rows[0] });
  } catch (err) {
    console.error("🔥 CATEGORY ADD ERROR:", err);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   GET ALL ACTIVE CATEGORIES (for dropdown)
============================================ */
router.get("/all", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT cat_id, cat_name FROM category WHERE is_deleted = false ORDER BY cat_name ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("🔥 CATEGORY LIST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   GET ALL CATEGORIES (ADMIN manage)
============================================ */
router.get("/manage", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT cat_id, cat_name, is_deleted, created_by
       FROM category
       ORDER BY cat_id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("🔥 CATEGORY MANAGE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   UPDATE CATEGORY NAME (ADMIN)
============================================ */
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_name } = req.body;

    if (!cat_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const { rows } = await db.query(
      `UPDATE category
       SET cat_name = $1
       WHERE cat_id = $2
       RETURNING *`,
      [cat_name, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated", category: rows[0] });
  } catch (err) {
    console.error("🔥 CATEGORY UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   SOFT DELETE CATEGORY (ADMIN)
============================================ */
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await db.query(
      `UPDATE category
       SET is_deleted = true
       WHERE cat_id = $1`,
      [id]
    );

    if (!rowCount) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted (soft)" });
  } catch (err) {
    console.error("🔥 CATEGORY DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
