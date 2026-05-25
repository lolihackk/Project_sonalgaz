const table = document.getElementById("messagesTable");

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

async function loadMessages() {

    try {

        const response = await fetch(
            "http://localhost:5000/messages"
        );

        const messages = await response.json();

        table.innerHTML = "";

        messages.forEach(message => {

const row = `

<tr>

    <td>
        ${message.local_message_number || "-"}
    </td>

    <td>
        ${message.correspondent_message_number || "-"}
    </td>

    <td>
        ${message.district_message_number || "-"}
    </td>

    <td>${message.district}</td>

    <td>${message.voltage}</td>

    <td>
        ${getStatusBadge(message.status)}
    </td>

    <td>${message.motif}</td>

    <td>${message.chef_conduite}</td>

    <td>
        ${new Date(
            message.created_date
        ).toLocaleDateString()}
    </td>

    <td>
        ${message.created_time}
    </td>

</tr>
`;

            table.innerHTML += row;
        });

    } catch (error) {

        console.error(error);

        alert("Failed to load messages");
    }
}

loadMessages();