const express = require("express");
const router = express.Router();

const pool = require("../config/db");

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`

            SELECT
                messages.id,
                messages.message_number,
                messages.created_date,
                messages.created_time,
                messages.local_message_number,
messages.correspondent_message_number,
messages.district_message_number,
                messages.motif,
                messages.chef_conduite,

                districts.name AS district,

                voltage_levels.label AS voltage,

                message_types.name AS message_type,

                statuses.name AS status,

                ouvrage_types.name AS ouvrage

            FROM messages

            LEFT JOIN districts
            ON messages.district_id = districts.id

            LEFT JOIN voltage_levels
            ON messages.voltage_level_id = voltage_levels.id

            LEFT JOIN message_types
            ON messages.message_type_id = message_types.id

            LEFT JOIN statuses
            ON messages.status_id = statuses.id

            LEFT JOIN ouvrage_types
            ON messages.ouvrage_type_id = ouvrage_types.id

            ORDER BY messages.id DESC

        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch messages"
        });
    }
});

module.exports = router;
router.post("/", async (req, res) => {

    try {

        const {
            local_message_number,
            correspondent_message_number,
            district_message_number,
            district_id,
            voltage_level_id,
            message_type_id,
            status_id,
            ouvrage_type_id,
            motif,
            chef_conduite,
            notes
        } = req.body;
const latestMessage = await pool.query(`
    SELECT message_number
    FROM messages
    ORDER BY message_number DESC
    LIMIT 1
`);

let newMessageNumber = 1;

if (latestMessage.rows.length > 0) {
    newMessageNumber =
        latestMessage.rows[0].message_number + 1;
}

if (newMessageNumber > 999) {
    newMessageNumber = 1;
}
        const result = await pool.query(
            `
            INSERT INTO messages (
                message_number,
                local_message_number,
                correspondent_message_number,
                district_message_number,
                district_id,
                voltage_level_id,
                message_type_id,
                status_id,
                ouvrage_type_id,
                motif,
                chef_conduite,
                notes
            )

            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
            )

            RETURNING *
            `,
            [
                newMessageNumber,
                local_message_number,
                correspondent_message_number,
                district_message_number,
                district_id,
                voltage_level_id,
                message_type_id,
                status_id,
                ouvrage_type_id,
                motif,
                chef_conduite,
                notes
            ]
        );

        res.status(201).json({
            message: "Message created successfully",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create message"
        });
    }
});