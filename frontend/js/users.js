/* =====================================
   ADMIN PAGE PROTECTION
===================================== */

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "user"
        )
    );


if (
    !currentUser ||
    currentUser.role !== "admin"
) {


    window.location.replace(
        "../index.html"
    );
}






/* =============================
   LOAD USERS
============================= */

async function loadUsers() {


    try {


        const response =
            await fetch(

                "http://localhost:5000/users",

                {

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )
                    }
                }
            );



        const users =
            await response.json();



        const table =
            document.getElementById(
                "usersTable"
            );



        table.innerHTML =
            "";



        users.forEach(
            user => {


                table.innerHTML +=
                `

                <tr>

                    <td>
                        ${user.username}
                    </td>


                    <td>
                        ${user.role}
                    </td>


                    <td>

<button
    class="edit-btn"
    onclick="openEditUser(
        ${user.id},
        '${user.username}',
        '${user.role}'
    )">

    <i class="fa-solid fa-pen"></i>

</button>


                        <button
                            class="delete-btn"
                            onclick="deleteUser(${user.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

                `;
            }
        );


    } catch (error) {


        console.error(
            error
        );
    }
}



loadUsers();









/* =============================
   CREATE USER
============================= */

document
    .getElementById(
        "createUserBtn"
    )
    .addEventListener(

        "click",

        async () => {


            try {


                await fetch(

                    "http://localhost:5000/users",

                    {

                        method:
                            "POST",


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
                            JSON.stringify({

                                username:
                                    newUsername.value,


                                password:
                                    newPassword.value,


                                role:
                                    newRole.value
                            })
                    }
                );




                newUsername.value =
                    "";


                newPassword.value =
                    "";



                loadUsers();



            } catch (error) {


                console.error(
                    error
                );
            }
        }
    );








/* =====================================
   DELETE USER MODAL
===================================== */


let deleteUserId =
    null;



function deleteUser(
    id
) {


    deleteUserId =
        id;



    document
        .getElementById(
            "deleteUserModal"
        )
        .style.display =
            "flex";
}







document
    .getElementById(
        "cancelUserDelete"
    )
    .addEventListener(

        "click",

        () => {


            deleteUserId =
                null;



            document
                .getElementById(
                    "deleteUserModal"
                )
                .style.display =
                    "none";
        }
    );









document
    .getElementById(
        "confirmUserDelete"
    )
    .addEventListener(

        "click",

        async () => {


            if (
                !deleteUserId
            ) {


                return;
            }



            try {


                await fetch(

                    `http://localhost:5000/users/${deleteUserId}`,

                    {

                        method:
                            "DELETE",


                        headers: {


                            Authorization:
                                "Bearer " +
                                localStorage.getItem(
                                    "token"
                                )
                        }
                    }
                );





                document
                    .getElementById(
                        "deleteUserModal"
                    )
                    .style.display =
                        "none";




                deleteUserId =
                    null;



                loadUsers();



            } catch(error) {


                console.error(
                    error
                );
            }
        }
    );







/* =====================================
   SHOW / HIDE PASSWORD
===================================== */


const toggleNewPassword =
    document.getElementById(
        "toggleNewPassword"
    );


const newPasswordInput =
    document.getElementById(
        "newPassword"
    );



if (
    toggleNewPassword &&
    newPasswordInput
) {


    toggleNewPassword
        .addEventListener(

            "click",

            () => {


                if (
                    newPasswordInput.type ===
                    "password"
                ) {


                    newPasswordInput.type =
                        "text";


                    toggleNewPassword
                        .classList
                        .replace(
                            "fa-eye",
                            "fa-eye-slash"
                        );


                } else {


                    newPasswordInput.type =
                        "password";


                    toggleNewPassword
                        .classList
                        .replace(
                            "fa-eye-slash",
                            "fa-eye"
                        );
                }
            }
        );
}





/* =====================================
   EDIT USER MODAL
===================================== */

let editingUserId =
    null;



function openEditUser(
    id,
    username,
    role
) {


    editingUserId =
        id;


    editUsername.value =
        username;


    editRole.value =
        role;


    editPassword.value =
        "";


    editUserModal.style.display =
        "flex";
}





cancelUserEdit.addEventListener(
    "click",
    () => {


        editUserModal.style.display =
            "none";
    }
);






saveUserEdit.addEventListener(

    "click",

    async () => {


        await fetch(

            `http://localhost:5000/users/${editingUserId}`,

            {

                method:
                    "PUT",


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
                    JSON.stringify({

                        username:
                            editUsername.value,


                        password:
                            editPassword.value,


                        role:
                            editRole.value
                    })
            }
        );



        editUserModal.style.display =
            "none";


        loadUsers();
    }
);







/* EDIT PASSWORD EYE */

toggleEditPassword.addEventListener(

    "click",

    () => {


        if (
            editPassword.type === "password"
        ) {


            editPassword.type =
                "text";


            toggleEditPassword.classList.replace(
                "fa-eye",
                "fa-eye-slash"
            );


        } else {


            editPassword.type =
                "password";


            toggleEditPassword.classList.replace(
                "fa-eye-slash",
                "fa-eye"
            );
        }
    }
);




/* =====================================
   LOGOUT
===================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );



if (
    logoutBtn
) {


    logoutBtn.addEventListener(

        "click",

        () => {


            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "user"
            );



            window.location.replace(
                "../login.html"
            );
        }
    );
}