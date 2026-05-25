const express = require("express");

const router = express.Router();

const pool = require("../config/db");

router.get("/monthly", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                COUNT(*) AS total_transfers,

                COUNT(*) FILTER (
                    WHERE is_emergency = false
                ) AS planned_transfers,

                COUNT(*) FILTER (
                    WHERE is_emergency = true
                ) AS emergency_transfers,

                COUNT(*) FILTER (
                    WHERE transfer_completed = true
                ) AS completed_transfers,

                COUNT(*) FILTER (
                    WHERE status_id = 5
                ) AS refused_transfers

            FROM messages

            WHERE DATE_TRUNC(
                'month',
                created_date
            ) = DATE_TRUNC(
                'month',
                CURRENT_DATE
            )

        `);

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate report"
        });
    }
});
router.get("/by-voltage", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                voltage_levels.label AS voltage,

                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE is_emergency = false
                ) AS planned,

                COUNT(*) FILTER (
                    WHERE is_emergency = true
                ) AS emergency,

                COUNT(*) FILTER (
                    WHERE transfer_completed = true
                ) AS completed,

                COUNT(*) FILTER (
                    WHERE status_id = 5
                ) AS refused

            FROM messages

            LEFT JOIN voltage_levels
            ON messages.voltage_level_id =
            voltage_levels.id

            GROUP BY voltage_levels.label

            ORDER BY voltage_levels.label

        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to load voltage report"
        });
    }
});
router.get("/by-ouvrage", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                ouvrage_types.name AS ouvrage,

                COUNT(*) AS total

            FROM messages

            LEFT JOIN ouvrage_types
            ON messages.ouvrage_type_id =
            ouvrage_types.id

            GROUP BY ouvrage_types.name

            ORDER BY total DESC

        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to load ouvrage report"
        });
    }
});
module.exports = router;