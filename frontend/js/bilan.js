async function loadBilan() {

    try {
      const voltageTable =
    document.getElementById("voltageTable");

const ouvrageTable =
    document.getElementById("ouvrageTable");

        const response = await fetch(
            "http://localhost:5000/reports/monthly"
        );

        const data = await response.json();

        document.getElementById(
            "totalTransfers"
        ).textContent =
            data.total_transfers;

        document.getElementById(
            "plannedTransfers"
        ).textContent =
            data.planned_transfers;

        document.getElementById(
            "emergencyTransfers"
        ).textContent =
            data.emergency_transfers;

        document.getElementById(
            "completedTransfers"
        ).textContent =
            data.completed_transfers;

        document.getElementById(
            "refusedTransfers"
        ).textContent =
            data.refused_transfers;

    } catch (error) {

        console.error(error);

        alert("Failed to load bilan");
    }
}

loadBilan();
async function loadVoltageReport() {

    const response = await fetch(
        "http://localhost:5000/reports/by-voltage"
    );

    const data = await response.json();

    voltageTable.innerHTML = "";

    data.forEach(item => {

        voltageTable.innerHTML += `

            <tr>

                <td>${item.voltage}</td>

                <td>${item.total}</td>

                <td>${item.planned}</td>

                <td>${item.emergency}</td>

                <td>${item.completed}</td>

                <td>${item.refused}</td>

            </tr>
        `;
    });
}

async function loadOuvrageReport() {

    const response = await fetch(
        "http://localhost:5000/reports/by-ouvrage"
    );

    const data = await response.json();

    ouvrageTable.innerHTML = "";

    data.forEach(item => {

        ouvrageTable.innerHTML += `

            <tr>

                <td>${item.ouvrage}</td>

                <td>${item.total}</td>

            </tr>
        `;
    });
}

loadVoltageReport();

loadOuvrageReport();