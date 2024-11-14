// Partner Management Functions
function viewPartnerDetails(partnerId) {
    fetch(`/api/partners/analytics/${partnerId}`)
        .then(response => response.json())
        .then(data => {
            updatePartnerModal(data);
            new bootstrap.Modal(document.getElementById('partnerDetailsModal')).show();
        });
}

function updateContribution(partnerId) {
    const newAmount = prompt("Enter new monthly contribution amount ($):");
    if (newAmount && !isNaN(newAmount)) {
        fetch('/api/partners/update-contribution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                partner_id: partnerId,
                new_amount: parseFloat(newAmount)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    }
}

function initializePartnerCharts() {
    // Initialize contribution history chart
    const ctx = document.getElementById('partnerContributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Monthly Contributions',
                data: [],
                borderColor: '#4BC0C0',
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
} 