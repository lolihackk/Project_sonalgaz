const express = require("express");

const router = express.Router();

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

/* CHECK API KEY */

console.log(
    "Gemini Key:",
    process.env.GEMINI_API_KEY
);

/* GEMINI SETUP */

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

/* AI MOTIF ROUTE */

router.post(
    "/generate-motif",
    async (req, res) => {

    console.log(
        "AI route reached"
    );

    try {

        const { prompt } =
            req.body;

        /* MODEL */

        const model =
            genAI.getGenerativeModel({

                model:
                    "gemini-2.0-flash"
            });

        /* AI REQUEST */

        const result =
            await model.generateContent(

`
You are a professional SONALGAZ
dispatching assistant.

Generate professional electrical
transfer motifs in French.

Rules:
- concise
- technical
- professional
- realistic dispatching language
- maximum 3 lines
- no markdown
- no bullet points

Request:
${prompt}
`
            );

        /* EXTRACT TEXT */

        const text =
            await result.response.text();

        /* DEBUG */

        console.log(
            "Generated text:",
            text
        );

        /* SEND RESPONSE */

        res.json({

            motif: text
        });

    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );

res.status(500).json({

    error:
        error.message
});
    }
});

module.exports = router;

