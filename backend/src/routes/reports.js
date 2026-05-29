const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const XLSX = require("xlsx");

/* =========================
   MONTHLY SUMMARY
========================= */

router.get("/monthly", async (req, res) => {

    try {

        const { month } = req.query;

        const result =
            await pool.query(

                `
                SELECT

                    COUNT(*) AS total_transfers,

COUNT(*) FILTER (
    WHERE message_type_id = 1
) AS planned_transfers,

                    COUNT(*) FILTER (
                        WHERE is_emergency = true
                    ) AS emergency_transfers,

COUNT(*) FILTER (
    WHERE status_id = 3
) AS completed_transfers,

                    COUNT(*) FILTER (
                        WHERE status_id = 5
                    ) AS refused_transfers

                FROM messages

                WHERE TO_CHAR(
                    created_date,
                    'YYYY-MM'
                ) = $1
                `,
                [month]
            );

        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to generate report"
        });
    }
});

/* =========================
   BY VOLTAGE
========================= */

router.get("/by-voltage", async (req, res) => {

    try {

        const { month } = req.query;

        const result =
            await pool.query(

                `
                SELECT

                    voltage_levels.label AS voltage,

                    COUNT(*) AS total,

COUNT(*) FILTER (
    WHERE message_type_id = 1
) AS planned,

COUNT(*) FILTER (
    WHERE status_id = 3
) AS completed,

                    COUNT(*) FILTER (
                        WHERE status_id = 4
                    ) AS cancelled_os,

                    COUNT(*) FILTER (
                        WHERE status_id = 5
                    ) AS cancelled_rte

                FROM messages

                LEFT JOIN voltage_levels
                ON messages.voltage_level_id =
                   voltage_levels.id

                WHERE TO_CHAR(
                    created_date,
                    'YYYY-MM'
                ) = $1

                GROUP BY voltage_levels.label

                ORDER BY voltage_levels.label
                `,
                [month]
            );

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to load voltage report"
        });
    }
});

/* =========================
   PLANNED REPORT
========================= */

router.get("/planned", async (req, res) => {

    try {

        const { month } = req.query;

        const result =
            await pool.query(

                `
                SELECT

                    voltage_levels.label AS voltage,

COUNT(*) FILTER (
    WHERE message_type_id = 1
) AS planned,

COUNT(*) FILTER (
    WHERE status_id = 3
) AS completed,

                    COUNT(*) FILTER (
                        WHERE status_id = 4
                    ) AS cancelled_os,

                    COUNT(*) FILTER (
                        WHERE status_id = 5
                    ) AS cancelled_rte

                FROM messages

                LEFT JOIN voltage_levels
                ON messages.voltage_level_id =
                   voltage_levels.id

                WHERE TO_CHAR(
                    created_date,
                    'YYYY-MM'
                ) = $1

                GROUP BY voltage_levels.label

                ORDER BY voltage_levels.label
                `,
                [month]
            );

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to load planned report"
        });
    }
});

/* =========================
   BY OUVRAGE
========================= */

router.get(
    "/by-ouvrage",
    async (req, res) => {

    try {

        const { month } =
            req.query;


        const result =
            await pool.query(

`
SELECT

    CONCAT(
        ouvrage_types.name,
        ' ',
        voltage_levels.label
    ) AS ouvrage,

    COUNT(*) AS total

FROM messages


LEFT JOIN ouvrage_types
ON messages.ouvrage_type_id =
ouvrage_types.id


LEFT JOIN voltage_levels
ON messages.voltage_level_id =
voltage_levels.id


WHERE TO_CHAR(
    messages.created_date,
    'YYYY-MM'
) = $1


GROUP BY

    ouvrage_types.name,

    voltage_levels.label


ORDER BY

    total DESC
`,
            [month]
        );


        res.json(
            result.rows
        );


    } catch (error) {


        console.error(error);


        res.status(500).json({

            error:
                "Failed to load ouvrage report"
        });
    }
});

/* =========================
   EXPORT EXCEL
========================= */

router.get("/export-excel", async (req, res) => {

    try {

        const { month } = req.query;

        const result =
            await pool.query(

                `
                SELECT

                    messages.message_number,

                    messages.local_message_number,

                    messages.correspondent_message_number,

                    messages.motif,

                    messages.created_date,

                    messages.created_time,

                    voltage_levels.label AS voltage,

                    statuses.name AS status,

                    districts.name AS district

                FROM messages

                LEFT JOIN voltage_levels
                ON messages.voltage_level_id =
                   voltage_levels.id

                LEFT JOIN statuses
                ON messages.status_id =
                   statuses.id

                LEFT JOIN districts
                ON messages.district_id =
                   districts.id

                WHERE TO_CHAR(
                    created_date,
                    'YYYY-MM'
                ) = $1

                ORDER BY messages.id DESC
                `,
                [month]
            );

        const workbook =
            XLSX.utils.book_new();

        const worksheet =
            XLSX.utils.json_to_sheet(
                result.rows
            );

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Bilan"
        );

        const buffer =
            XLSX.write(

                workbook,

                {
                    type: "buffer",
                    bookType: "xlsx"
                }
            );

        res.setHeader(

            "Content-Disposition",

            `attachment; filename=BILAN_${month}.xlsx`
        );

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.send(buffer);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Excel export failed"
        });
    }
});

/* =====================================
   FULL DETAILS REPORT
===================================== */

router.get(
    "/full-details",
    async (req, res) => {

    try {

        const { month } =
            req.query;

        const result =
            await pool.query(

`
SELECT

    messages.created_date,

    voltage_levels.label
        AS voltage,


    CONCAT(
        ouvrage_types.name,
        ' ',
        voltage_levels.label
    ) AS ouvrage,

    districts.name
        AS district,

    message_types.name
        AS message_type,

    statuses.name
        AS status,

    messages.chef_conduite,

    messages.motif

FROM messages

LEFT JOIN voltage_levels
ON messages.voltage_level_id =
voltage_levels.id

LEFT JOIN ouvrage_types
ON messages.ouvrage_type_id =
ouvrage_types.id

LEFT JOIN districts
ON messages.district_id =
districts.id

LEFT JOIN message_types
ON messages.message_type_id =
message_types.id

LEFT JOIN statuses
ON messages.status_id =
statuses.id

WHERE TO_CHAR(
    messages.created_date,
    'YYYY-MM'
) = $1

ORDER BY
messages.created_date DESC
`,
                [month]
            );

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to load detailed report"
        });
    }
});


module.exports = router;