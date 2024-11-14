document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    const valueCtx = document.getElementById('valueProjectionChart').getContext('2d');
    const btcCtx = document.getElementById('btcAccumulationChart').getContext('2d');
    let valueChart, btcChart;

    // Growth rates for different scenarios
    const growthRates = {
        conservative: 0.5,  // 50% annual
        moderate: 1.0,     // 100% annual
        aggressive: 2.0    // 200% annual
    };

    function calculateProjections() {
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
        const years = parseInt(document.getElementById('projectionYears').value);
        const scenario = document.getElementById('growthScenario').value;
        const startingPrice = parseFloat(document.getElementById('btcPrice').value);
        
        const months = years * 12;
        const monthlyGrowthRate = Math.pow(1 + growthRates[scenario], 1/12);
        
        const labels = [];
        const values = [];
        const btcHoldings = [];
        let totalBTC = parseFloat("{{ total_btc }}");
        let currentPrice = startingPrice;
        
        for (let i = 0; i <= months; i++) {
            // Add label
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            
            // Calculate BTC bought this month
            if (i > 0) {
                const btcBought = monthlyContribution / currentPrice;
                totalBTC += btcBought;
                currentPrice *= monthlyGrowthRate;
            }
            
            // Add values
            btcHoldings.push(totalBTC);
            values.push(totalBTC * currentPrice);
        }

        // Update summary
        document.getElementById('totalInvestment').textContent = 
            `$${(monthlyContribution * months).toLocaleString()}`;
        document.getElementById('projectedBTC').textContent = 
            `${totalBTC.toFixed(8)} BTC`;
        document.getElementById('projectedValue').textContent = 
            `$${(totalBTC * currentPrice).toLocaleString()}`;
        document.getElementById('projectedROI').textContent = 
            `${(((totalBTC * currentPrice) / (monthlyContribution * months) - 1) * 100).toFixed(1)}%`;

        return { labels, values, btcHoldings };
    }

    function updateCharts() {
        const data = calculateProjections();
        
        // Update value projection chart
        if (valueChart) valueChart.destroy();
        valueChart = new Chart(valueCtx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Portfolio Value (USD)',
                    data: data.values,
                    borderColor: '#4BC0C0',
                    backgroundColor: '#4BC0C040',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
        
        // Update BTC accumulation chart
        if (btcChart) btcChart.destroy();
        btcChart = new Chart(btcCtx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'BTC Holdings',
                    data: data.btcHoldings,
                    borderColor: '#F7931A',
                    backgroundColor: '#F7931A40',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => value.toFixed(8) + ' BTC'
                        }
                    }
                }
            }
        });
    }

    // Add event listeners
    document.getElementById('monthlyContribution').addEventListener('change', updateCharts);
    document.getElementById('projectionYears').addEventListener('change', updateCharts);
    document.getElementById('growthScenario').addEventListener('change', updateCharts);

    // Initial chart render
    updateCharts();
}); 