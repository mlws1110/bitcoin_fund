document.addEventListener('DOMContentLoaded', function() {
    // Bitcoin Price Chart
    const ctx = document.getElementById('bitcoinChart').getContext('2d');
    const priceData = {
        labels: [],
        prices: []
    };
    
    const bitcoinChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceData.labels,
            datasets: [{
                label: 'Bitcoin Price',
                data: priceData.prices,
                borderColor: '#F7931A',
                backgroundColor: 'rgba(247, 147, 26, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    // Partner Distribution Chart
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: [
                'Equiano Stewart', 'Michael Williams', 'Christopher Mosley', 
                'Trevor Morgan', 'Marquise Williams', 'Paul Campbell',
                'James Mitchell', 'Jamall Moss'
            ],
            datasets: [{
                data: [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#33CC99', '#FF99CC'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });

    // Simulate Bitcoin price updates
    function updateBitcoinPrice() {
        const price = Math.random() * (50000 - 40000) + 40000;
        const change = (Math.random() * 10) - 5;
        
        document.getElementById('btcPrice').textContent = `$${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
        
        const changeElement = document.getElementById('btcChange');
        changeElement.textContent = `${change.toFixed(2)}%`;
        changeElement.className = `badge ${change >= 0 ? 'bg-success' : 'bg-danger'}`;
        
        // Update chart
        const now = new Date();
        priceData.labels.push(now.toLocaleTimeString());
        priceData.prices.push(price);
        
        if (priceData.labels.length > 20) {
            priceData.labels.shift();
            priceData.prices.shift();
        }
        
        bitcoinChart.update();
    }

    // Update price every 30 seconds
    setInterval(updateBitcoinPrice, 30000);
    updateBitcoinPrice();

    // Set next contribution date
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    document.getElementById('nextContributionDate').textContent = 
        nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}); 