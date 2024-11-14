document.addEventListener('DOMContentLoaded', function() {
    // Get slider elements
    const monthlyContributionSlider = document.getElementById('monthlyContribution');
    const investmentYearsSlider = document.getElementById('investmentYears');
    const growthRateSlider = document.getElementById('growthRate');
    
    // Get value display elements
    const monthlyContributionValue = document.getElementById('monthlyContributionValue');
    const investmentYearsValue = document.getElementById('investmentYearsValue');
    const growthRateValue = document.getElementById('growthRateValue');
    const teamMonthlyTotal = document.getElementById('teamMonthlyTotal');
    const totalInvestment = document.getElementById('totalInvestment');
    const projectedValue = document.getElementById('projectedValue');
    const totalBTC = document.getElementById('totalBTC');

    // Get current Bitcoin price
    const currentPrice = parseFloat(document.querySelector('h2').innerText.replace('$', '').replace(/,/g, ''));
    
    // Initialize chart
    let projectionChart = null;

    function updateSimulation() {
        const monthlyContribution = parseInt(monthlyContributionSlider.value);
        const years = parseInt(investmentYearsSlider.value);
        const growthRate = parseInt(growthRateSlider.value) / 100;
        const teamMonthly = monthlyContribution * 8; // 8 partners
        
        // Update display values
        monthlyContributionValue.textContent = `$${monthlyContribution}`;
        investmentYearsValue.textContent = `${years} Years`;
        growthRateValue.textContent = `${growthRateSlider.value}% per year`;
        teamMonthlyTotal.textContent = `$${teamMonthly.toLocaleString()}`;

        // Calculate projections
        const months = years * 12;
        const monthlyGrowthRate = Math.pow(1 + growthRate, 1/12);
        
        const projectionData = calculateProjection(
            currentPrice,
            teamMonthly,
            months,
            monthlyGrowthRate
        );

        // Update summary values
        totalInvestment.textContent = `$${projectionData.totalInvested.toLocaleString()}`;
        projectedValue.textContent = `$${projectionData.finalValue.toLocaleString()}`;
        totalBTC.textContent = `${projectionData.totalBTC.toFixed(8)} BTC`;

        // Update chart
        updateChart(projectionData, years);
    }

    function calculateProjection(startPrice, monthlyUSD, months, monthlyGrowthRate) {
        let currentPrice = startPrice;
        let totalBTC = 0;
        let totalInvested = 0;
        const prices = [startPrice];
        const investmentValues = [0];
        const btcHoldings = [0];
        const dates = generateDates(months);

        for (let month = 1; month <= months; month++) {
            currentPrice *= monthlyGrowthRate;
            const btcBought = monthlyUSD / currentPrice;
            totalBTC += btcBought;
            totalInvested += monthlyUSD;

            prices.push(currentPrice);
            btcHoldings.push(totalBTC);
            investmentValues.push(totalBTC * currentPrice);
        }

        return {
            dates,
            prices,
            investmentValues,
            btcHoldings,
            totalBTC,
            totalInvested,
            finalValue: investmentValues[investmentValues.length - 1]
        };
    }

    function updateChart(data, years) {
        if (projectionChart) {
            projectionChart.destroy();
        }

        const ctx = document.getElementById('projectionChart').getContext('2d');
        
        // Calculate pure DCA growth (no BTC appreciation)
        const monthlyContribution = parseInt(monthlyContributionSlider.value);
        const teamMonthly = monthlyContribution * 8;
        const pureDCAValues = data.dates.map((_, i) => {
            const totalMonths = i + 1;
            return teamMonthly * totalMonths;  // Simple accumulation of monthly contributions
        });

        projectionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [
                    {
                        label: 'Portfolio Value (with BTC Growth)',
                        data: data.investmentValues,
                        borderColor: '#4BC0C0',
                        backgroundColor: '#4BC0C040',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Pure DCA (No BTC Growth)',
                        data: pureDCAValues,
                        borderColor: '#9966FF',
                        backgroundColor: '#9966FF40',
                        fill: true,
                        tension: 0.4,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Total Invested',
                        data: data.dates.map((_, i) => (i * data.totalInvested / (years * 12))),
                        borderColor: '#FF6384',
                        backgroundColor: '#FF638440',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const label = context.dataset.label;
                                const formattedValue = value.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                });
                                
                                // Calculate and show ROI for portfolio value
                                if (label.includes('Portfolio Value')) {
                                    const roi = ((value / pureDCAValues[context.dataIndex] - 1) * 100).toFixed(1);
                                    return `${label}: ${formattedValue} (ROI: ${roi}%)`;
                                }
                                
                                return `${label}: ${formattedValue}`;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '$' + (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return '$' + (value / 1000).toFixed(1) + 'K';
                                }
                                return '$' + value;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Portfolio Value (USD)',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Investment Timeline',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    // Add event listeners to sliders
    monthlyContributionSlider.addEventListener('input', updateSimulation);
    investmentYearsSlider.addEventListener('input', updateSimulation);
    growthRateSlider.addEventListener('input', updateSimulation);

    // Initial simulation
    updateSimulation();
});

function generateDates(months) {
    const dates = [];
    const currentDate = new Date();
    
    for (let i = 0; i < months; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + i);
        dates.push(date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric'
        }));
    }
    
    return dates;
}

function generateLongTermPriceProjection(startPrice, growth) {
    const prices = [startPrice];
    let currentPrice = startPrice;
    
    // Generate prices for each year
    for (let year = 1; year <= 10; year++) {
        const yearlyGrowth = growth[`year${year}`];
        
        // Calculate monthly growth rate from yearly rate
        const monthlyGrowth = Math.pow(yearlyGrowth, 1/12);
        
        // Generate monthly prices for the year
        for (let month = 1; month <= 12; month++) {
            currentPrice *= monthlyGrowth;
            prices.push(currentPrice);
        }
    }
    
    return prices;
}

function calculateInvestmentProjections(currentPrice, monthlyContribution, scenarios) {
    const projections = {};
    
    Object.entries(scenarios).forEach(([key, scenario]) => {
        const prices = generateLongTermPriceProjection(currentPrice, scenario.growth);
        const values = [0];  // Start with 0
        let totalBTC = 0;
        
        // Calculate monthly investment values
        for (let month = 1; month < prices.length; month++) {
            const btcBought = monthlyContribution / prices[month];
            totalBTC += btcBought;
            values.push(totalBTC * prices[month]);
        }
        
        projections[key] = values;
    });
    
    return projections;
} 