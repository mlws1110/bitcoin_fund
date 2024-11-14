document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    let projectionChart;
    const currentBtcPrice = 45000; // Example starting price

    function calculateProjections() {
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
        const btcPriceChange = parseFloat(document.getElementById('btcChangeSlider').value) / 100;
        const months = parseInt(document.getElementById('projectionPeriod').value);
        
        // Calculate projected BTC price
        const projectedPrice = currentBtcPrice * (1 + btcPriceChange);
        
        const labels = [];
        const investmentData = [];
        const valueData = [];
        let totalInvested = 0;
        let totalBTC = 0;
        
        // Calculate monthly accumulation
        for (let i = 0; i <= months; i++) {
            // Generate date label
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            
            // Calculate values for this month
            if (i > 0) {
                const monthlyBTC = monthlyContribution / 
                    (currentBtcPrice + (projectedPrice - currentBtcPrice) * (i / months));
                totalBTC += monthlyBTC;
                totalInvested += monthlyContribution;
            }
            
            investmentData.push(totalInvested);
            valueData.push(totalBTC * projectedPrice);
        }
        
        // Update summary stats
        document.getElementById('totalInvestment').textContent = 
            `$${totalInvested.toLocaleString()}`;
        document.getElementById('projectedBTC').textContent = 
            `${totalBTC.toFixed(8)} BTC`;
        document.getElementById('projectedValue').textContent = 
            `$${(totalBTC * projectedPrice).toLocaleString()}`;
        document.getElementById('projectedROI').textContent = 
            `${((totalBTC * projectedPrice / totalInvested - 1) * 100).toFixed(1)}%`;
        
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