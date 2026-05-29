require("dotenv").config({
    path: "../.env"
});

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");


async function testAI() {

    console.log(
        "KEY:",
        process.env.GEMINI_API_KEY
            ? "FOUND"
            : "MISSING"
    );


    const genAI =
        new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );


    try {

        const model =
            genAI.getGenerativeModel({

                model:
                    "gemini-2.5-flash"
            });


        const result =
            await model.generateContent(

`
You are a SONALGAZ dispatching assistant.

Generate a professional electrical transfer motif in French.

Request:
Maintenance ligne 220KV
`

            );


        const text =
            await result.response.text();


        console.log(
            "AI RESPONSE:"
        );


        console.log(
            text
        );


    } catch (error) {


        console.log(
            "AI ERROR:"
        );


        console.log(
            error
        );
    }

}


testAI();