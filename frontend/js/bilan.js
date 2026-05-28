const totalTransfers =
    document.getElementById(
        "totalTransfers"
    );

const plannedTransfers =
    document.getElementById(
        "plannedTransfers"
    );

const emergencyTransfers =
    document.getElementById(
        "emergencyTransfers"
    );

const completedTransfers =
    document.getElementById(
        "completedTransfers"
    );

const refusedTransfers =
    document.getElementById(
        "refusedTransfers"
    );

const voltageTable =
    document.getElementById(
        "voltageTable"
    );

const ouvrageTable =
    document.getElementById(
        "ouvrageTable"
    );

const plannedTable =
    document.getElementById(
        "plannedTable"
    );

const monthFilter =
    document.getElementById(
        "monthFilter"
    );

const loadBilanBtn =
    document.getElementById(
        "loadBilanBtn"
    );

const exportExcelBtn =
    document.getElementById(
        "exportExcelBtn"
    );

/* LOAD BILAN */

async function loadBilan() {

    try {

        let month =
            monthFilter.value;

        /* DEFAULT CURRENT MONTH */

        if (!month) {

            const today =
                new Date();

            month =
                `${today.getFullYear()}-${
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0")
                }`;

            monthFilter.value =
                month;
        }

        /* MONTHLY SUMMARY */

        const response =
            await fetch(

                `http://localhost:5000/reports/monthly?month=${month}`
            );

        const data =
            await response.json();

        /* CARDS */

        totalTransfers.textContent =
            data.total_transfers || 0;

        plannedTransfers.textContent =
            data.planned_transfers || 0;

        emergencyTransfers.textContent =
            data.emergency_transfers || 0;

        completedTransfers.textContent =
            data.completed_transfers || 0;

        refusedTransfers.textContent =
            data.refused_transfers || 0;

        /* KPI */

        const approvalRate =
            data.total_transfers > 0

            ? Math.round(
                (
                    data.completed_transfers /
                    data.total_transfers
                ) * 100
            )

            : 0;

        const refusalRate =
            data.total_transfers > 0

            ? Math.round(
                (
                    data.refused_transfers /
                    data.total_transfers
                ) * 100
            )

            : 0;

        document.getElementById(
            "approvalRate"
        ).textContent =
            approvalRate + "%";

        document.getElementById(
            "completionRate"
        ).textContent =
            approvalRate + "%";

        document.getElementById(
            "refusalRate"
        ).textContent =
            refusalRate + "%";

        /* LOAD TABLES */

        await loadVoltageReport(month);

        await loadOuvrageReport(month);

        await loadPlannedReport(month);

    } catch (error) {

        console.error(error);

        alert(
            "Failed to load bilan"
        );
    }
}

/* VOLTAGE TABLE */

async function loadVoltageReport(month) {

    try {

        const response =
            await fetch(

                `http://localhost:5000/reports/by-voltage?month=${month}`
            );

        const data =
            await response.json();

        voltageTable.innerHTML = "";

        data.forEach(item => {

            voltageTable.innerHTML += `

                <tr>

                    <td>
                        ${item.voltage}
                    </td>

                    <td>
                        ${item.total}
                    </td>

                    <td>
                        ${item.planned}
                    </td>

                    <td>
                        ${item.completed}
                    </td>

                    <td>
                        ${item.cancelled_os}
                    </td>

                    <td>
                        ${item.cancelled_rte}
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

/* PLANNED TABLE */

async function loadPlannedReport(month) {

    try {

        const response =
            await fetch(

                `http://localhost:5000/reports/planned?month=${month}`
            );

        const data =
            await response.json();

        plannedTable.innerHTML = "";

        data.forEach(item => {

            plannedTable.innerHTML += `

                <tr>

                    <td>
                        ${item.voltage}
                    </td>

                    <td>
                        ${item.planned}
                    </td>

                    <td>
                        ${item.completed}
                    </td>

                    <td>
                        ${item.cancelled_os}
                    </td>

                    <td>
                        ${item.cancelled_rte}
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

/* OUVRAGE TABLE */

async function loadOuvrageReport(month) {

    try {

        const response =
            await fetch(

                `http://localhost:5000/reports/by-ouvrage?month=${month}`
            );

        const data =
            await response.json();

        ouvrageTable.innerHTML = "";

        data.forEach(item => {

            ouvrageTable.innerHTML += `

                <tr>

                    <td>
                        ${item.ouvrage}
                    </td>

                    <td>
                        ${item.total}
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

/* EXPORT EXCEL */

exportExcelBtn.addEventListener(
    "click",
    () => {

        const month =
            monthFilter.value;

        window.open(

            `http://localhost:5000/reports/export-excel?month=${month}`
        );
    }
);

/* LOAD BUTTON */

loadBilanBtn.addEventListener(
    "click",
    () => {

        loadBilan();
    }
);
/* PRINT PDF */

const printBtn =
    document.getElementById(
        "printBtn"
    );

printBtn.addEventListener(
    "click",
    () => {

        window.print();
    }
);
/* INITIAL LOAD */

loadBilan();