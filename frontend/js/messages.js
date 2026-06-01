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

/* =========================================
   PROFESSIONAL TOAST
========================================= */

function showToast(
    message,
    type = "success"
) {

    let background;


    if (type === "success") {

        background =
            "linear-gradient(135deg,#22c55e,#16a34a)";

    } else if (type === "error") {

        background =
            "linear-gradient(135deg,#ef4444,#dc2626)";

    } else if (type === "warning") {

        background =
            "linear-gradient(135deg,#f59e0b,#d97706)";

    } else {

        background =
            "linear-gradient(135deg,#2563eb,#7c3aed)";
    }


    Toastify({

        text:
            message,

        duration:
            3500,

        gravity:
            "top",

        position:
            "right",

        close:
            true,

        stopOnFocus:
            true,

        style: {

            background,

            borderRadius:
                "16px",

            padding:
                "16px 22px",

            fontWeight:
                "600",

            boxShadow:
                "0 15px 35px rgba(0,0,0,.35)"
        }

    }).showToast();
}





/* =========================================
   AI MOTIF GENERATOR
========================================= */

generateAiBtn.addEventListener(
    "click",
    async () => {


    if (
        motifTextarea.value.trim()
        === ""
    ) {


        showToast(
            "Enter operation information before generating motif",
            "warning"
        );


        return;
    }



    try {


        /* GET FORM VALUES */


        const voltage =
            voltageSelect.options[
                voltageSelect.selectedIndex
            ].text;



        const ouvrage =
            document
                .getElementById(
                    "ouvrage_type_id"
                )
                .selectedOptions[0]
                .text;



        const district =
            document
                .getElementById(
                    "district_id"
                )
                .selectedOptions[0]
                .text;



        const messageType =
            document
                .getElementById(
                    "message_type_id"
                )
                .selectedOptions[0]
                .text;



        const status =
            document
                .getElementById(
                    "status_id"
                )
                .selectedOptions[0]
                .text;



        const chef =
            document
                .getElementById(
                    "chef_conduite"
                )
                .value;




        /* AI CONTEXT */


        const prompt = `

Informations message SONALGAZ:

Type opération:
${messageType}

Ouvrage concerné:
${ouvrage}

Niveau de tension:
${voltage}

District:
${district}

Etat du message:
${status}

Chef de conduite:
${chef}

Information opérateur:
${motifTextarea.value}


Créer uniquement le MOTIF officiel SONALGAZ.
Utiliser toutes les informations disponibles.

Si l'information opérateur contient une durée
(ex: 1h, 2 heures, 30 minutes),
la considérer comme durée de l'opération.

`;




        /* LOADING */


        generateAiBtn.disabled =
            true;


        generateAiBtn.innerHTML =
            "Generating...";


        showToast(
            "AI is preparing SONALGAZ motif...",
            "info"
        );





        /* REQUEST */


        const response =
            await fetch(

                "https://sonalgaz-api.onrender.com/ai/generate-motif",

                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"
                    },


                    body:
                        JSON.stringify({

                            prompt
                        })
                }
            );




        const data =
            await response.json();




        if (!response.ok) {


            throw new Error(
                data.error
            );
        }




        /* INSERT RESULT */


        motifTextarea.value =
            data.motif;




        showToast(

            "AI motif generated successfully",

            "success"
        );




    } catch (error) {



        console.error(
            error
        );



        let errorMessage =
            error.message;



        if (
            errorMessage
                .toLowerCase()
                .includes(
                    "quota"
                )
        ) {


            errorMessage =
                "AI quota reached, please try again later";
        }




        showToast(

            errorMessage,

            "error"
        );



    } finally {



        generateAiBtn.disabled =
            false;



        generateAiBtn.innerHTML =
            "Generate AI";
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

ouvrage_type_id:
    document.getElementById(
        "ouvrage_type_id"
    ).value,

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

    "https://sonalgaz-api.onrender.com/messages",

    {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json",


            Authorization:
                "Bearer " +
                localStorage.getItem(
                    "token"
                )
        },


        body:
            JSON.stringify(
                data
            )
    }
);

        const result = await response.json();

        console.log(result);

Toastify({

    text:
        "Message saved successfully",

    duration: 3000,

    gravity: "top",

    position: "right",

    stopOnFocus: true,

    close: false,

    style: {

        background:
            "linear-gradient(to right, #22c55e, #16a34a)",

        borderRadius: "0px",

        padding: "18px 22px",

        fontWeight: "500",

        boxShadow: "none"
    }

}).showToast();

form.reset();

/* RESET FORM LOGIC */

updateVoltageFields();

    } catch (error) {

        console.error(error);

        Toastify({

    text:
        "Failed to save message",

    duration: 3000,

    gravity: "top",

    position: "right",

    stopOnFocus: true,

    close: true,

    style: {

        background:
            "linear-gradient(to right, #ef4444, #dc2626)",

        borderRadius: "14px",

        padding: "16px",

        fontWeight: "700",

        boxShadow:
            "0 10px 30px rgba(0,0,0,0.25)"
    }

}).showToast();
    }
});
const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "../login.html";
        }
    );
}