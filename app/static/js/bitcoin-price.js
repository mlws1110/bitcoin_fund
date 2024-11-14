function updateBitcoinPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        .then(response => response.json())
        .then(data => {
            const price = data.bitcoin.usd;
            const change24h = data.bitcoin.usd_24h_change;
            
            // Update price display
            document.getElementById('btc-price').innerHTML = `$${price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
            
            // Update 24h change
            const changeElement = document.getElementById('btc-change');
            changeElement.innerHTML = `${change24h.toFixed(2)}% (24h)`;
            changeElement.className = `price-change ${change24h >= 0 ? 'positive' : 'negative'}`;
            
            // Update arrow icon
            const arrowIcon = document.getElementById('btc-arrow');
            arrowIcon.className = `bi ${change24h >= 0 ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill'}`;
        })
        .catch(error => console.error('Error fetching Bitcoin price:', error));
}

// Update price every 30 seconds
setInterval(updateBitcoinPrice, 30000);

// Initial update
document.addEventListener('DOMContentLoaded', updateBitcoinPrice); 