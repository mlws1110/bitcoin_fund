document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    let projectionChart;
    let currentBtcPrice = 45000; // Will be updated with real price

    // Fetch current Bitcoin price
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            currentBtcPrice = data.bitcoin.usd;
            updateChart();
        });

    function calculateProjections() {
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
        const annualReturn = parseFloat(document.getElementById('btcChangeSlider').value) / 100;
        const years = parseInt(document.getElementById('projectionPeriod').value) / 12;
        
        const labels = [];
        const investmentData = [];
        const valueData = [];
        
        // Calculate yearly values instead of monthly
        for (let year = 0; year <= years; year++) {
            // Generate year label
            const date = new Date();
            date.setFullYear(date.getFullYear() + year);
            labels.push(date.getFullYear().toString());
            
            // Calculate total invested for this year
            const totalInvested = monthlyContribution * 12 * year;
            investmentData.push(totalInvested);
            
            // Calculate BTC price for this year using compound annual growth
            const projectedPrice = currentBtcPrice * Math.pow(1 + annualReturn, year);
            
            // Calculate BTC accumulated (assuming average price over the year)
            const yearlyBtc = year === 0 ? 0 : (monthlyContribution * 12) / 
                (currentBtcPrice * Math.pow(1 + annualReturn, year - 0.5));
            const totalBtc = yearlyBtc * year;
            
            // Calculate total value
            valueData.push(totalBtc * projectedPrice);
        }
        
        // Update summary stats
        const finalYear = years;
        const totalInvested = monthlyContribution * 12 * finalYear;
        const finalPrice = currentBtcPrice * Math.pow(1 + annualReturn, finalYear);
        const totalBtc = (monthlyContribution * 12 * finalYear) / 
            (currentBtcPrice * Math.pow(1 + annualReturn, finalYear - 0.5));
        const finalValue = totalBtc * finalPrice;
        
        document.getElementById('totalInvestment').textContent = 
            `$${totalInvested.toLocaleString()}`;
        document.getElementById('projectedBTC').textContent = 
            `${totalBtc.toFixed(8)} BTC`;
        document.getElementById('projectedValue').textContent = 
            `$${finalValue.toLocaleString()}`;
        document.getElementById('projectedROI').textContent = 
            `${((finalValue / totalInvested - 1) * 100).toFixed(1)}%`;
        
        return { labels, investmentData, valueData };
    }

    function updateChart() {
        const data = calculateProjections();
        
        if (projectionChart) {
            projectionChart.destroy();
        }
        
        projectionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Investment',
                    data: data.investmentData,
                    borderColor: '#FF9F40',
                    backgroundColor: '#FF9F4020',
                    fill: true
                }, {
                    label: 'Portfolio Value',
                    data: data.valueData,
                    borderColor: '#4BC0C0',
                    backgroundColor: '#4BC0C020',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Update Bitcoin change display
    document.getElementById('btcChangeSlider').addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        const element = document.getElementById('btcChangeValue');
        element.textContent = `${value > 0 ? '+' : ''}${value}%`;
        element.className = `badge ${value >= 0 ? 'bg-success' : 'bg-danger'}`;
        updateChart();
    });

    // Add event listeners for other controls
    document.getElementById('monthlyContribution').addEventListener('input', updateChart);
    document.getElementById('projectionPeriod').addEventListener('change', updateChart);

    // Initial chart render
    updateChart();
}); 