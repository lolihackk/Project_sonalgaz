require("dotenv").config();

const pool =
    require("./src/config/db");

async function seedMessages() {

    try {

        for (let i = 1; i <= 30; i++) {

            const districtId =
                Math.floor(Math.random() * 8) + 1;

            const voltageId =
                Math.floor(Math.random() * 5) + 1;

            const messageTypeId =
                Math.floor(Math.random() * 3) + 1;

            const statusId =
                Math.floor(Math.random() * 5) + 1;

            await pool.query(

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

                    $1,$2,$3,$4,$5,$6,
                    $7,$8,$9,$10,$11,$12
                )
                `,

                [

                    i,

                    Math.floor(
                        Math.random() * 999
                    ),

                    Math.floor(
                        Math.random() * 999
                    ),

                    Math.floor(
                        Math.random() * 999
                    ),

                    districtId,

                    voltageId,

                    messageTypeId,

                    statusId,

                    1,

                    `Maintenance ligne ${i}`,

                    `Chef ${i}`,

                    `Generated test message ${i}`
                ]
            );
        }

        console.log(
            "Fake messages inserted!"
        );

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit();
    }
}

seedMessages();