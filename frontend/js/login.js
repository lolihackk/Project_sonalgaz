/* =====================================
   PROFESSIONAL TOAST
===================================== */

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






/* =====================================
   LOGIN
===================================== */


const form =
    document.getElementById(
        "loginForm"
    );



form.addEventListener(
    "submit",
    async (e) => {


        e.preventDefault();



        const username =
            document
                .getElementById(
                    "username"
                )
                .value
                .trim();



        const password =
            document
                .getElementById(
                    "password"
                )
                .value;




        if (
            username === "" ||
            password === ""
        ) {


            showToast(

                "Please enter username and password",

                "warning"
            );


            return;
        }




        const loginBtn =
            document.querySelector(
                ".login-btn"
            );



        try {


            loginBtn.disabled =
                true;



            loginBtn.innerHTML =
                "Checking...";



            showToast(

                "Checking credentials...",

                "info"
            );





            const response =
                await fetch(

                    "https://sonalgaz-api.onrender.com/auth/login",

                    {

                        method:
                            "POST",



                        headers: {

                            "Content-Type":
                                "application/json"
                        },



                        body:
                            JSON.stringify({

                                username,

                                password
                            })
                    }
                );





            const result =
                await response.json();





            if (
                !response.ok
            ) {


                throw new Error(

                    result.error ||
                    "Invalid login"
                );
            }





            /* SAVE AUTH DATA */


            localStorage.setItem(

                "token",

                result.token
            );



            localStorage.setItem(

                "user",

                JSON.stringify(
                    result.user
                )
            );





            showToast(

                "Login successful, welcome back",

                "success"
            );





            setTimeout(
                () => {


                    window.location.href =
                        "index.html";


                },

                1000
            );




        } catch (error) {


            console.error(
                error
            );



            showToast(

                error.message ||
                "Login failed",

                "error"
            );



        } finally {



            loginBtn.disabled =
                false;



            loginBtn.innerHTML =
                "Login";
        }

    }
);







/* =====================================
   SHOW / HIDE PASSWORD
===================================== */


const passwordInput =
    document.getElementById(
        "password"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );



if (
    passwordInput &&
    togglePassword
) {


    togglePassword.addEventListener(

        "click",

        () => {



            if (
                passwordInput.type ===
                "password"
            ) {



                passwordInput.type =
                    "text";



                togglePassword.classList.remove(

                    "fa-eye"
                );



                togglePassword.classList.add(

                    "fa-eye-slash"
                );



            } else {



                passwordInput.type =
                    "password";



                togglePassword.classList.remove(

                    "fa-eye-slash"
                );



                togglePassword.classList.add(

                    "fa-eye"
                );
            }
        }
    );
}