async function loadDashboard() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/messages"
            );

        const messages =
            await response.json();

        console.log(messages);

        /* TOTAL */

        document.getElementById(
            "totalMessages"
        ).textContent =
            messages.length;

        /* ACTIVE */

        const active =
            messages.filter(

                m =>
                    m.status === "Pending"
            ).length;

        document.getElementById(
            "activeTransfers"
        ).textContent =
            active;

        /* FINISHED */

        const finished =
            messages.filter(

                m =>
                    m.status === "Finished"
            ).length;

        document.getElementById(
            "finishedTransfers"
        ).textContent =
            finished;

        /* VOLTAGE STATS */

        const voltageCounts = {};

        messages.forEach(message => {

            const voltage =
                message.voltage;

            if (!voltageCounts[voltage]) {

                voltageCounts[voltage] = 0;
            }

            voltageCounts[voltage]++;
        });

        /* STATUS STATS */

        const statusCounts = {};

        messages.forEach(message => {

            const status =
                message.status;

            if (!statusCounts[status]) {

                statusCounts[status] = 0;
            }

            statusCounts[status]++;
        });

        /* VOLTAGE CHART */

        new Chart(

            document.getElementById(
                "voltageChart"
            ),

            {
                type: "bar",

                data: {

                    labels:
                        Object.keys(
                            voltageCounts
                        ),

                    datasets: [

                        {

                            label:
                                "Transfers",

                            data:
                                Object.values(
                                    voltageCounts
                                ),

                            borderWidth: 1
                        }
                    ]
                },

                options: {

                    responsive: true
                }
            }
        );

        /* STATUS CHART */

        new Chart(

            document.getElementById(
                "statusChart"
            ),

            {
                type: "doughnut",

                data: {

                    labels:
                        Object.keys(
                            statusCounts
                        ),

                    datasets: [

                        {

                            data:
                                Object.values(
                                    statusCounts
                                ),

                            borderWidth: 1
                        }
                    ]
                },

                options: {

                    responsive: true
                }
            }
        );

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );
    }
}

loadDashboard();