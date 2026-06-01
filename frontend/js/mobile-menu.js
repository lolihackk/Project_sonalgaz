const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const sidebar =
    document.querySelector(
        ".sidebar"
    );

const overlay =
    document.createElement(
        "div"
    );

overlay.className =
    "sidebar-overlay";

document.body.appendChild(
    overlay
);

if(
    menuToggle &&
    sidebar
){

    menuToggle.addEventListener(
        "click",
        ()=>{

            sidebar.classList.toggle(
                "active"
            );

            overlay.classList.toggle(
                "active"
            );
        }
    );

    overlay.addEventListener(
        "click",
        ()=>{

            sidebar.classList.remove(
                "active"
            );

            overlay.classList.remove(
                "active"
            );
        }
    );
}