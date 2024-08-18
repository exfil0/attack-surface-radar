let records = [];

function addRecord() {
    const entryPoint = document.getElementById('entryPoint').value;
    const attackVector = document.getElementById('attackVector').value;
    const riskImpact = document.getElementById('riskImpact').value;
    const targetAsset = document.getElementById('targetAsset').value;
    const subCategory = document.getElementById('subCategory').value;
    const value = document.getElementById('riskValue').value;

    if (entryPoint && attackVector && riskImpact && targetAsset && subCategory && value) {
        const record = { entryPoint, attackVector, riskImpact, targetAsset, subCategory, value: parseInt(value) };
        records.push(record);

        document.getElementById('entryPoint').value = '';
        document.getElementById('attackVector').value = '';
        document.getElementById('riskImpact').value = '';
        document.getElementById('targetAsset').value = '';
        document.getElementById('subCategory').value = '';
        document.getElementById('riskValue').value = '';

        updateLiveTable();
    } else {
        alert('Please fill in all fields before adding a record.');
    }
}

function updateLiveTable() {
    const tbody = document.getElementById('liveTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = tbody.insertRow();

        row.insertCell(0).textContent = record.entryPoint;
        row.insertCell(1).textContent = record.attackVector;
        row.insertCell(2).textContent = record.riskImpact;
        row.insertCell(3).textContent = record.targetAsset;
        row.insertCell(4).textContent = record.subCategory;
        row.insertCell(5).textContent = record.value;
    });
}

function updateDetailsTable() {
    const tbody = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = tbody.insertRow();

        row.insertCell(0).textContent = record.entryPoint;
        row.insertCell(1).textContent = record.attackVector;
        row.insertCell(2).textContent = record.riskImpact;
        row.insertCell(3).textContent = record.targetAsset;
        row.insertCell(4).textContent = record.subCategory;
        row.insertCell(5).textContent = record.value;
    });
}

function generateGraph() {
    try {
        document.getElementById('loadingSpinner').style.display = 'block';

        // Clear existing chart if any
        const canvas = document.getElementById('attackSurfaceChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateDetailsTable();

        const labels = [...new Set(records.map(record => `${record.entryPoint} - ${record.attackVector} - ${record.riskImpact}`))];
        const dataValues = records.map(record => record.value);

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attack Surface',
                    data: dataValues,
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }
            }
        });

        generateReport();
    } catch (error) {
        console.error('Error generating graph:', error);
        alert('An error occurred while generating the graph. Please try again.');
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

function generateReport() {
    const totalRecords = records.length;
    const highRiskCount = records.filter(record => record.riskImpact === 'High').length;
    const mediumRiskCount = records.filter(record => record.riskImpact === 'Medium').length;
    const lowRiskCount = records.filter(record => record.riskImpact === 'Low').length;
    const averageRiskValue = (records.reduce((sum, record) => sum + record.value, 0) / totalRecords).toFixed(2);

    let reportWindow = window.open('', '_blank');
    let reportContent = `
    <html>
    <head>
        <title>Attack Surface Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333; }
            h1 { text-align: center; color: #007BFF; }
            h2 { margin-top: 40px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            #chartContainer { width: 100%; height: 400px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <h1>Attack Surface Analysis Report</h1>
        
        <h2>Summary</h2>
        <p><strong>Total Records:</strong> ${totalRecords}</p>
        <p><strong>High Risk Entries:</strong> ${highRiskCount}</p>
        <p><strong>Medium Risk Entries:</strong> ${mediumRiskCount}</p>
        <p><strong>Low Risk Entries:</strong> ${lowRiskCount}</p>
        <p><strong>Average Risk Value:</strong> ${averageRiskValue}</p>
        
        <div id="chartContainer">
            <canvas id="reportChart"></canvas>
        </div>
        
        <h2>Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Entry Point</th>
                    <th>Attack Vector</th>
                    <th>Risk Impact</th>
                    <th>Target Asset</th>
                    <th>Subcategory</th>
                    <th>Risk Value</th>
                </tr>
            </thead>
            <tbody>`;

    records.forEach(record => {
        reportContent += `
        <tr>
            <td>${record.entryPoint}</td>
            <td>${record.attackVector}</td>
            <td>${record.riskImpact}</td>
            <td>${record.targetAsset}</td>
            <td>${record.subCategory}</td>
            <td>${record.value}</td>
        </tr>`;
    });

    reportContent += `
            </tbody>
        </table>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            let ctx = document.getElementById('reportChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ${JSON.stringify([...new Set(records.map(record => `${record.entryPoint} - ${record.attackVector} - ${record.riskImpact}`))])},
                    datasets: [{
                        label: 'Attack Surface',
                        data: ${JSON.stringify(records.map(record => record.value))},
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { display: true },
                            suggestedMin: 0,
                            suggestedMax: 10
                        }
                    }
                }
            });
        </script>
    </body>
    </html>`;

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
}

function exportData() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Entry Point,Attack Vector,Risk Impact,Target Asset,Subcategory,Risk Value\n";

    records.forEach(record => {
        csvContent += `${record.entryPoint},${record.attackVector},${record.riskImpact},${record.targetAsset},${record.subCategory},${record.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attack_surface_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
