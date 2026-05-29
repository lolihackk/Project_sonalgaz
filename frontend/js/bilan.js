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

/* =====================================
   ENTERPRISE EXCEL EXPORT
===================================== */

exportExcelBtn.addEventListener(
    "click",
    async () => {

        await exportExcel();
    }
);

async function exportExcel() {

    try {

        const workbook =
            XLSX.utils.book_new();

        const month =
            monthFilter.value || "report";

        /* =====================================
           FETCH FULL DETAILS
        ===================================== */

        const response =
            await fetch(

                `http://localhost:5000/reports/full-details?month=${month}`
            );

        const details =
            await response.json();

        /* =====================================
           SUMMARY SHEET
        ===================================== */

        const summaryData = [

            ["SONALGAZ"],
            ["Dispatching Center"],
            [""],

            ["MONTHLY TRANSFER REPORT"],

            ["Month", month],

            [
                "Export Date",
                new Date().toLocaleDateString()
            ],

            [""],

            ["KPI", "Value"],

            [
                "Total Transfers",
                totalTransfers.textContent
            ],

            [
                "Planned Transfers",
                plannedTransfers.textContent
            ],

            [
                "Emergency Transfers",
                emergencyTransfers.textContent
            ],

            [
                "Completed Transfers",
                completedTransfers.textContent
            ],

            [
                "Refused Transfers",
                refusedTransfers.textContent
            ]
        ];

        const summarySheet =
            XLSX.utils.aoa_to_sheet(
                summaryData
            );

        summarySheet["!cols"] = [

            { wch: 35 },
            { wch: 25 }
        ];

        /* HEADER STYLE */

        [
            "A1",
            "A2",
            "A4"
        ].forEach(cell => {

            if (summarySheet[cell]) {

                summarySheet[cell].s = {

                    font: {

                        bold: true,
                        sz: 16,
                        color: {
                            rgb: "FFFFFF"
                        }
                    },

                    fill: {

                        fgColor: {
                            rgb: "1E3A8A"
                        }
                    }
                };
            }
        });

        XLSX.utils.book_append_sheet(

            workbook,
            summarySheet,
            "Summary"
        );

        /* =====================================
           PLANNED TABLE
        ===================================== */

        const plannedSheet =
            XLSX.utils.table_to_sheet(

                document.getElementById(
                    "plannedExportTable"
                )
            );

        plannedSheet["!cols"] = [

            { wch: 18 },
            { wch: 15 },
            { wch: 15 },
            { wch: 18 },
            { wch: 18 }
        ];

        XLSX.utils.book_append_sheet(

            workbook,
            plannedSheet,
            "Planned Transfers"
        );

        /* =====================================
           NON PLANNED TABLE
        ===================================== */

        const voltageSheet =
            XLSX.utils.table_to_sheet(

                document.getElementById(
                    "voltageExportTable"
                )
            );

        voltageSheet["!cols"] = [

            { wch: 18 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 18 },
            { wch: 18 }
        ];

        XLSX.utils.book_append_sheet(

            workbook,
            voltageSheet,
            "Non Planned"
        );

        /* =====================================
           OUVRAGE TABLE
        ===================================== */

        const ouvrageSheet =
            XLSX.utils.table_to_sheet(

                document.getElementById(
                    "ouvrageExportTable"
                )
            );

        ouvrageSheet["!cols"] = [

            { wch: 30 },
            { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(

            workbook,
            ouvrageSheet,
            "Ouvrages"
        );

        /* =====================================
           DETAILED TRANSFERS SHEET
        ===================================== */

        const detailData = [

[
    "Date",

    "Voltage",

    "Ouvrage",

    "District",

    "Type",

    "Status",

    "Chef Conduite",

    "Motif"
]
        ];

        details.forEach(item => {

detailData.push([

    item.created_date,

    item.voltage,

    item.ouvrage,

    item.district,

    item.message_type,

    item.status,

    item.chef_conduite,

    item.motif
]);
        });

        const detailSheet =
            XLSX.utils.aoa_to_sheet(
                detailData
            );

        detailSheet["!cols"] = [

            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 18 },
            { wch: 18 },
            { wch: 22 },
            { wch: 60 }
        ];

        /* HEADER COLORS */

        const range =
            XLSX.utils.decode_range(
                detailSheet["!ref"]
            );

        for (
            let C = range.s.c;
            C <= range.e.c;
            ++C
        ) {

            const address =
                XLSX.utils.encode_cell({
                    r: 0,
                    c: C
                });

            if (!detailSheet[address]) {

                continue;
            }

            detailSheet[address].s = {

                font: {

                    bold: true,
                    color: {
                        rgb: "FFFFFF"
                    }
                },

                fill: {

                    fgColor: {
                        rgb: "2563EB"
                    }
                },

                alignment: {

                    horizontal: "center"
                }
            };
        }

        XLSX.utils.book_append_sheet(

            workbook,
            detailSheet,
            "Detailed Transfers"
        );

        /* =====================================
           EXPORT FILE
        ===================================== */

        XLSX.writeFile(

            workbook,

            `SONALGAZ_Enterprise_Report_${month}.xlsx`
        );

        Toastify({

            text:
                "Enterprise Excel exported successfully",

            duration: 3000,

            gravity: "top",

            position: "right",

            style: {

                background:
                    "linear-gradient(to right, #22c55e, #16a34a)"
            }

        }).showToast();

    } catch (error) {

        console.error(error);

        Toastify({

            text:
                "Failed to export Excel",

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

loadBilan();