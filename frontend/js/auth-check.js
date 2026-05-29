/* =====================================
   AUTH CHECK
===================================== */

const token =
    localStorage.getItem(
        "token"
    );


if (
    !token
) {


    const isInsidePages =
        window.location.pathname.includes(
            "/pages/"
        );


    if (
        isInsidePages
    ) {


        window.location.replace(
            "../login.html"
        );


    } else {


        window.location.replace(
            "login.html"
        );
    }
}