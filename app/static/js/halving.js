function updateHalvingCountdown() {
    const halvingDate = new Date('2024-04-20'); // Estimated date
    const now = new Date();
    const difference = halvingDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('halvingCountdown').innerHTML = 
        `Next Halving: ${days} Days, ${hours} Hours, ${minutes} Minutes`;
}

setInterval(updateHalvingCountdown, 60000);
updateHalvingCountdown(); 