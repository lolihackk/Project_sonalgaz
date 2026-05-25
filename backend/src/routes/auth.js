const express = require("express");

const router = express.Router();

const pool = require("../config/db");

/* LOGIN */

router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const result = await pool.query(

            `
            SELECT *
            FROM users
            WHERE username = $1
            AND password = $2
            `,
            [username, password]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        res.json({
            message: "Login successful",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Login failed"
        });
    }
});

module.exports = router;