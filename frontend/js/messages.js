const form = document.getElementById("messageForm");

const voltageSelect =
    document.getElementById("voltage_level_id");

const rpnField =
    document.getElementById("rpnField");

const districtField =
    document.getElementById("districtField");
const generateAiBtn =
    document.getElementById("generateAiBtn");

const motifTextarea =
    document.getElementById("motif");
/* SMART VOLTAGE LOGIC */

function updateVoltageFields() {

    const selectedVoltage =
        voltageSelect.options[
            voltageSelect.selectedIndex
        ].text;

    /* 60KV => DISTRICT NUMBER */

    if (selectedVoltage === "60KV") {

        districtField.style.display = "block";

        rpnField.style.display = "none";
    }

    /* OTHER VOLTAGES => RPN */

    else {

        districtField.style.display = "none";

        rpnField.style.display = "block";
    }
}

/* RUN ON PAGE LOAD */

updateVoltageFields();

/* RUN WHEN VOLTAGE CHANGES */

voltageSelect.addEventListener(
    "change",
    updateVoltageFields
);
/* AI MOTIF GENERATOR */

generateAiBtn.addEventListener(
    "click",
    async () => {
console.log("AI button clicked");
    try {

        const voltage =
            voltageSelect.options[
                voltageSelect.selectedIndex
            ].text;

        const district =
            document.getElementById(
                "district_id"
            ).options[
                document.getElementById(
                    "district_id"
                ).selectedIndex
            ].text;

        const prompt = `

Generate a professional SONALGAZ
electrical transfer motif in French.

Voltage:
${voltage}

District:
${district}

Current user notes:
${motifTextarea.value}
`;

        generateAiBtn.innerText =
            "Generating...";

        const response = await fetch(

            "http://localhost:5000/ai/generate-motif",

            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    prompt
                })
            }
        );

        const data =
            await response.json();

        motifTextarea.value =
            data.motif;

        generateAiBtn.innerText =
            "Generate AI Motif";

    } catch (error) {

        console.error(error);

        alert("AI generation failed");

        generateAiBtn.innerText =
            "Generate AI Motif";
    }
});
/* FORM SUBMIT */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        /* LOCAL NUMBER */

        local_message_number:
            document.getElementById(
                "local_message_number"
            ).value,

        /* RPN */

        correspondent_message_number:

            rpnField.style.display === "block"

            ?

            document.getElementById(
                "correspondent_message_number"
            ).value

            :

            null,

        /* DISTRICT MESSAGE */

        district_message_number:

            districtField.style.display === "block"

            ?

            document.getElementById(
                "district_message_number"
            ).value

            :

            null,

        /* DISTRICT */

        district_id:
            document.getElementById(
                "district_id"
            ).value,

        /* VOLTAGE */

        voltage_level_id:
            document.getElementById(
                "voltage_level_id"
            ).value,

        /* MESSAGE TYPE */

        message_type_id:
            document.getElementById(
                "message_type_id"
            ).value,

        /* STATUS */

        status_id:
            document.getElementById(
                "status_id"
            ).value,

        /* OUVRAGE */

        ouvrage_type_id: 1,

        /* MOTIF */

        motif:
            document.getElementById(
                "motif"
            ).value,

        /* CHEF */

        chef_conduite:
            document.getElementById(
                "chef_conduite"
            ).value,

        /* NOTES */

        notes:
            document.getElementById(
                "notes"
            ).value
    };

    try {

        const response = await fetch(
            "http://localhost:5000/messages",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        console.log(result);

        alert("Message saved successfully!");

        form.reset();

        /* RESET FORM LOGIC */

        updateVoltageFields();

    } catch (error) {

        console.error(error);

        alert("Error saving message");
    }
});