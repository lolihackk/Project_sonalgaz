const form =
    document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

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

        const response = await fetch(
            "http://localhost:5000/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result =
            await response.json();

        if (response.ok) {

            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            window.location.href =
                "index.html";

        } else {

            alert(result.error);
        }

    } catch (error) {

        console.error(error);

        alert("Login failed");
    }
});