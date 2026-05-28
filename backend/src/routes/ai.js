
const express = require("express");

const router = express.Router();

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

/* =====================================
   GEMINI SETUP
===================================== */

console.log(
    "Gemini Key:",
    process.env.GEMINI_API_KEY
);

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

/* =====================================
   AI MOTIF ROUTE
===================================== */

router.post(
    "/generate-motif",
    async (req, res) => {

    console.log(
        "AI route reached"
    );

    try {

        const { prompt } =
            req.body;

        /* VALIDATION */

        if (!prompt) {

            return res.status(400).json({

                error:
                    "Prompt is required"
            });
        }

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

Your role is to generate
professional electrical transfer
motifs in French.

Rules:
- concise
- technical
- professional
- realistic dispatching language
- maximum 3 lines
- no markdown
- no bullet points
- no titles

Request:
${prompt}
`
            );

        /* EXTRACT TEXT */

        const text =
            await result.response.text();

        console.log(
            "Generated text:",
            text
        );

        /* RESPONSE */

        res.json({

            motif: text
        });

    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );

        /* QUOTA ERROR */

        if (
            error.message &&
            error.message.includes("429")
        ) {

            return res.status(429).json({

                error:
                    "AI quota reached. Please wait a few seconds."
            });
        }

        /* EXPIRED KEY */

        if (
            error.message &&
            error.message.includes("API key expired")
        ) {

            return res.status(401).json({

                error:
                    "Gemini API key expired."
            });
        }

        /* GENERIC */

        res.status(500).json({

            error:
                "AI generation failed"
        });
    }
});

module.exports = router;

