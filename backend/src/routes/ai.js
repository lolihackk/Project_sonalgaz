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

    console.log("AI route reached");

    try {

        const { prompt } = req.body;

        /* MODEL */

        const model =
            genAI.getGenerativeModel({
                model: "gemini-1.5-flash"
            });

        /* AI REQUEST */

        const result =
            await model.generateContent(

`
You are a professional SONALGAZ
dispatching assistant.

Generate professional electrical
transfer motifs in French.

Keep the response:
- concise
- technical
- professional

Request:
${prompt}
`
            );

        /* FULL DEBUG */

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        /* SAFE EXTRACTION */

        let text = "";

        if (
            result &&
            result.response &&
            result.response.candidates &&
            result.response.candidates.length > 0
        ) {

            text =
                result.response
                .candidates[0]
                .content.parts[0]
                .text;
        }

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
                "AI generation failed"
        });
    }
});

module.exports = router;