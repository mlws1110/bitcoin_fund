let bitcoinChart;
const priceData = {
    labels: [],
    prices: []
};

function initChart() {
    const ctx = document.getElementById('bitcoinChart').getContext('2d');
    
    bitcoinChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceData.labels,
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: priceData.prices,
                borderColor: '#F7931A',
                backgroundColor: 'rgba(247, 147, 26, 0.1)',
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function updatePrice() {
    fetch('/api/bitcoin-price')
        .then(response => response.json())
        .then(data => {
            // Update price display
            document.getElementById('btcPrice').textContent = `$${data.price.toLocaleString()}`;
            
            // Update change display
            const changeElement = document.getElementById('btcChange');
            changeElement.textContent = `${data.change_24h.toFixed(2)}%`;
            changeElement.className = `badge ${data.change_24h >= 0 ? 'bg-success' : 'bg-danger'}`;
            
            // Update chart
            const now = new Date();
            priceData.labels.push(now.toLocaleTimeString());
            priceData.prices.push(data.price);
            
            // Keep last 30 data points
            if (priceData.labels.length > 30) {
                priceData.labels.shift();
                priceData.prices.shift();
            }
            
            bitcoinChart.update();
        })
        .catch(error => console.error('Error fetching Bitcoin price:', error));
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Bitcoin chart...');
    initChart();
    updatePrice();
    // Update every 30 seconds
    setInterval(updatePrice, 30000);
}); 