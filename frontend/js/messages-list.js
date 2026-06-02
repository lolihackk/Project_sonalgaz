const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchType =
    document.getElementById(
        "searchType"
    );
const editStatus =
    document.getElementById(
        "editStatus"
    );
const table =
    document.getElementById(
        "messagesTable"
    );
    const deleteModal =
    document.getElementById(
        "deleteModal"
    );

const confirmDeleteBtn =
    document.getElementById(
        "confirmDelete"
    );

const cancelDeleteBtn =
    document.getElementById(
        "cancelDelete"
    );
    const editModal =
    document.getElementById(
        "editModal"
    );

const editMotif =
    document.getElementById(
        "editMotif"
    );

const editChef =
    document.getElementById(
        "editChef"
    );

const saveEditBtn =
    document.getElementById(
        "saveEdit"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEdit"
    );

let selectedEditId = null;

let selectedDeleteId = null;

/* STATUS BADGES */

function getStatusBadge(status) {

    if (status === "Pending") {

        return `
            <span class="badge pending">
                Pending
            </span>
        `;
    }

    if (status === "Finished") {

        return `
            <span class="badge finished">
                Finished
            </span>
        `;
    }

    if (status === "Cancelled") {

        return `
            <span class="badge cancelled">
                Cancelled
            </span>
        `;
    }

    if (status === "Refused") {

        return `
            <span class="badge refused">
                Refused
            </span>
        `;
    }

    return `
        <span class="badge">
            ${status}
        </span>
    `;
}

/* LOAD MESSAGES */

async function loadMessages(
    search = ""
) {

    try {

        const response =
    await fetch(

        "https://sonalgaz-api.onrender.com/messages",

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

        const messages =
            await response.json();

        console.log(messages);

        table.innerHTML = "";

        messages.forEach(message => {

            /* SEARCH LOGIC */

            const type =
                searchType.value;

            let value = "";

            if (type === "local") {

                value =
                    message.local_message_number;

            } else if (type === "rpn") {

                value =
                    message.correspondent_message_number;

            } else if (type === "district") {

                value =
                    message.district_message_number;

            } else if (
                type === "district_name"
            ) {

                value =
                    message.district;

            } else if (
                type === "voltage"
            ) {

                value =
                    message.voltage;

            } else if (
                type === "status"
            ) {

                value =
                    message.status;
            }

            if (
                search &&
                !String(value)
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
            ) {
                return;
            }

            /* TABLE ROW */

const row = `

<tr>

    <td>
        ${message.id}
    </td>

    <td>
        ${message.local_message_number ?? "-"}
    </td>

    <td>
        ${message.correspondent_message_number ?? "-"}
    </td>

    <td>
        ${message.district_message_number ?? "-"}
    </td>

    <td>
        ${message.district}
    </td>

<td>
    ${message.voltage}
</td>

<td>
    ${message.ouvrage}
</td>

<td>
    ${getStatusBadge(message.status)}
</td>

<td class="motif-cell">

    <div class="motif-preview">
        ${message.motif}
    </div>

    <div class="motif-tooltip">
        ${message.motif}
    </div>

</td>

    <td>
        ${message.chef_conduite}
    </td>

    <td>

        ${new Date(
            message.created_date
        ).toLocaleDateString()}

    </td>

    <td>

${message.created_time
    ? String(message.created_time).slice(0,5)
    : "--:--"}

    </td>

<td class="actions-cell">

    <button
        class="edit-btn"
        onclick="openEditModal(${message.id})">

        Edit

    </button>

    <button
        class="delete-btn"
        onclick="deleteMessage(${message.id})">

        Delete

    </button>

</td>

</tr>
`;

            table.innerHTML += row;
        });

    } catch (error) {

        console.error(error);

Toastify({

    text:
        "Failed to load messages",

    duration: 3000,

    gravity: "top",

    position: "right",

    style: {

        background:
            "linear-gradient(to right, #ef4444, #dc2626)"
    }

}).showToast();
    }
}

/* DELETE MESSAGE */

function deleteMessage(id) {

    selectedDeleteId = id;

    deleteModal.style.display =
        "flex";
}

/* CANCEL DELETE */

cancelDeleteBtn.addEventListener(
    "click",
    () => {

    deleteModal.style.display =
        "none";
});

/* CONFIRM DELETE */

confirmDeleteBtn.addEventListener(
    "click",
    async () => {

    try {

await fetch(

    `https://sonalgaz-api.onrender.com/messages/${selectedDeleteId}`,

    {

        method: "DELETE",

        headers: {

            Authorization:
                "Bearer " +
                localStorage.getItem(
                    "token"
                )
        }
    }
);

        deleteModal.style.display =
            "none";

        Toastify({

            text:
                "Message deleted successfully",

            duration: 3000,

            gravity: "top",

            position: "right",

            style: {

                background:
                    "linear-gradient(to right, #22c55e, #16a34a)"
            }

        }).showToast();

        loadMessages();

    } catch (error) {

        console.error(error);

        Toastify({

            text: "Delete failed",

            duration: 3000,

            gravity: "top",

            position: "right",

            style: {

                background:
                    "linear-gradient(to right, #ef4444, #dc2626)"
            }

        }).showToast();
    }
});

async function openEditModal(id) {

    selectedEditId = id;

const response =
    await fetch(

        "https://sonalgaz-api.onrender.com/messages",

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

    const messages =
        await response.json();

    const message =
        messages.find(
            m => m.id === id
        );

    editMotif.value =
        message.motif;

    editChef.value =
        message.chef_conduite;

    editModal.style.display =
        "flex";
        editStatus.value =
    message.status_id;
}

/* CANCEL EDIT */

cancelEditBtn.addEventListener(
    "click",
    () => {

    editModal.style.display =
        "none";
});

/* SAVE EDIT */

saveEditBtn.addEventListener(
    "click",
    async () => {

    try {

        await fetch(

            `https://sonalgaz-api.onrender.com/messages/${selectedEditId}`,

            {
                method: "PUT",

headers: {

    "Content-Type":
        "application/json",


    Authorization:
        "Bearer " +
        localStorage.getItem(
            "token"
        )
},

                body: JSON.stringify({

    motif:
        editMotif.value,

    chef_conduite:
        editChef.value,

    status_id:
        editStatus.value
})


            }
        );

        editModal.style.display =
            "none";

        Toastify({

            text:
                "Message updated successfully",

            duration: 3000,

            gravity: "top",

            position: "right",

            style: {

                background:
                    "linear-gradient(to right, #2563eb, #1d4ed8)"
            }

        }).showToast();

        loadMessages();

    } catch (error) {

        console.error(error);

        Toastify({

            text: "Update failed",

            duration: 3000,

            gravity: "top",

            position: "right",

            style: {

                background:
                    "linear-gradient(to right, #ef4444, #dc2626)"
            }

        }).showToast();
    }
});
/* LIVE SEARCH */

searchInput.addEventListener(
    "input",
    () => {

    loadMessages(
        searchInput.value
    );
});



/* GLOBAL FUNCTION */

window.deleteMessage =
    deleteMessage;

window.openEditModal =
    openEditModal;

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
/* INITIAL LOAD */

loadMessages();