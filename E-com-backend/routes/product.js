// routes/product.js
const express = require("express");
const db = require("../db");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================================
   CREATE PRODUCT  (ADMIN ONLY)
============================================ */
router.post("/add", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      brand,
      product_name,
      prod_description,
      price,
      stock,
      image_url,
      cat_id
    } = req.body;

    if (!brand || !product_name || !price || !cat_id) {
      return res.status(400).json({
        error: "Brand, product name, price and category are required"
      });
    }

    const { rows } = await db.query(
      `
      INSERT INTO products
      (brand, product_name, prod_description, price, stock, image_url, user_id, cat_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        brand,
        product_name,
        prod_description || "",
        price,
        stock || 0,
        image_url || "",
        req.user.user_id,
        cat_id
      ]
    );

    res.json({
      message: "Product added successfully",
      product: rows[0]
    });

  } catch (err) {
    console.error("🔥 ADD PRODUCT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   GET ALL PRODUCTS (USER + ADMIN)
============================================ */
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const { rows } = await db.query(
      `
      SELECT
        p.product_id,
        p.brand,
        p.product_name,
        p.prod_description,
        p.price,
        p.stock,
        p.image_url,
        p.cat_id,
        p.is_deleted,
        c.cat_name
      FROM products p
      LEFT JOIN category c ON p.cat_id = c.cat_id
      ${isAdmin ? "" : "WHERE p.is_deleted = false"}
      ORDER BY p.created_at DESC
      `
    );

    res.json({ products: rows });

  } catch (err) {
    console.error("🔥 LIST PRODUCTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   GET SINGLE PRODUCT (USED BY ProductDetails)
============================================ */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(
      `
      SELECT
        p.product_id,
        p.brand,
        p.product_name,
        p.prod_description,
        p.price,
        p.stock,
        p.image_url,
        p.cat_id,
        p.is_deleted,
        c.cat_name
      FROM products p
      LEFT JOIN category c ON p.cat_id = c.cat_id
      WHERE p.product_id = $1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("🔥 PRODUCT DETAILS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================
   UPDATE PRODUCT (ADMIN ONLY)
============================================ */
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      brand,
      product_name,
      prod_description,
      price,
      stock,
      image_url,
      cat_id
    } = req.body;

    const { rows } = await db.query(
      `
      UPDATE products
      SET
        brand = $1,
        product_name = $2,
        prod_description = $3,
        price = $4,
        stock = $5,
        image_url = $6,
        cat_id = $7
      WHERE product_id = $8
      RETURNING *
      `,
      [
        brand,
        product_name,
        prod_description || "",
        price,
        stock || 0,
        image_url || "",
        cat_id,
        id
      ]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: rows[0]
    });

  } catch (err) {
    console.error("🔥 UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
