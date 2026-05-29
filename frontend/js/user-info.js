/* =====================================
   USER INFO DISPLAY
===================================== */


const user =
    JSON.parse(
        localStorage.getItem(
            "user"
        )
    );



const userInfo =
    document.getElementById(
        "userInfo"
    );




if (
    user &&
    userInfo
) {


    userInfo.innerHTML =
        `

        <div class="user-avatar">

            ${user.username[0].toUpperCase()}

        </div>


        <div>


            <strong>

                ${user.username}

            </strong>



            <span>

                ${user.role}

            </span>


        </div>

        `;
}







/* =====================================
   ADMIN LINK VISIBILITY
===================================== */


const adminLink =
    document.getElementById(
        "adminLink"
    );



if (
    adminLink
) {


    if (
        !user ||
        user.role !== "admin"
    ) {


        adminLink.style.display =
            "none";


    } else {


        adminLink.style.display =
            "block";
    }
}