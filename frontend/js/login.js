
const form =
    document.getElementById(
        "loginForm"
    );

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const data = {

            username:
                document.getElementById(
                    "username"
                ).value,

            password:
                document.getElementById(
                    "password"
                ).value
        };

        try {

            const response =
                await fetch(

                    "http://localhost:5000/auth/login",

                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                data
                            )
                    }
                );

            const result =
                await response.json();

            if (response.ok) {

                localStorage.setItem(

                    "user",

                    JSON.stringify(
                        result.user
                    )
                );

                window.location.href =
                    "index.html";

            } else {

                alert(
                    result.error
                );
            }

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Login failed"
            );
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

