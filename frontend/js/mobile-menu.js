const menuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.getElementById("sidebarOverlay");

if(menuBtn){

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("active");

        overlay.classList.toggle("active");

    });

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

    });
}