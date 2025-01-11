// Constants for emissions calculations (in metric tons)
const YEARLY_EMISSIONS = 36.8 * 1000000000; // 36.8 billion metric tons in 2023
const DAILY_EMISSIONS = YEARLY_EMISSIONS / 365;
const HOURLY_EMISSIONS = DAILY_EMISSIONS / 24;
const MINUTE_EMISSIONS = HOURLY_EMISSIONS / 60;
const SECOND_EMISSIONS = MINUTE_EMISSIONS / 60;

// Country emission percentages of global total
const COUNTRY_EMISSIONS = {
    'china': 0.27,      // 27% of global emissions
    'us': 0.15,         // 15%
    'india': 0.07,      // 7%
    'russia': 0.05,     // 5%
    'japan': 0.03,      // 3%
    'germany': 0.02,    // 2%
    'iran': 0.02,       // 2%
    'skorea': 0.02,     // 2%
    'saudi': 0.02,      // 2%
    'indonesia': 0.02   // 2%
};

// Initialize variables
let startTime = new Date();
let selectedCountry = 'china';

// Format large numbers with commas
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update time ago display
function updateTimeAgo() {
    const now = new Date();
    const seconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    let timeString = '';
    if (hours > 0) {
        timeString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        timeString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        timeString = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
    
    document.getElementById('timeAgo').textContent = timeString;
}

// Update all counters
function updateCounters() {
    const now = new Date();
    const secondsElapsed = (now - startTime) / 1000;
    
    // Update total emissions
    const totalEmissions = secondsElapsed * SECOND_EMISSIONS;
    document.getElementById('totalEmissions').textContent = formatNumber(totalEmissions);
    
    // Update country emissions
    const countryEmissions = totalEmissions * COUNTRY_EMISSIONS[selectedCountry];
    document.getElementById('countryEmissions').textContent = formatNumber(countryEmissions);
    
    // Update country info
    const percentage = (COUNTRY_EMISSIONS[selectedCountry] * 100).toFixed(1);
    document.getElementById('countryInfo').textContent = `${percentage}% of global emissions`;
    
    // Update yearly emissions
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearSeconds = (now - yearStart) / 1000;
    const yearlyTotal = yearSeconds * SECOND_EMISSIONS;
    document.getElementById('yearlyEmissions').textContent = formatNumber(yearlyTotal);
    
    // Update year references
    const currentYear = now.getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    document.getElementById('yearReference').textContent = currentYear;
    
    // Update time ago
    updateTimeAgo();
}

// Handle country selection
function handleCountrySelect() {
    const select = document.getElementById('countrySelect');
    select.addEventListener('change', (e) => {
        selectedCountry = e.target.value;
        updateCounters();
    });
}

// Initialize charts
function initializeCharts() {
    // Country Emissions Chart
    const countryCtx = document.querySelector('#countryChart canvas').getContext('2d');
    new Chart(countryCtx, {
        type: 'bar',
        data: {
            labels: ['China', 'United States', 'India', 'Russia', 'Japan'],
            datasets: [{
                label: 'Annual CO₂ Emissions (Billion Metric Tons)',
                data: [10.5, 5.1, 2.7, 1.7, 1.1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top 5 CO₂ Emitting Countries'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Billion Metric Tons CO₂'
                    }
                }
            }
        }
    });

    // Sector Emissions Chart
    const sectorCtx = document.querySelector('#productChart canvas').getContext('2d');
    new Chart(sectorCtx, {
        type: 'bar',
        data: {
            labels: ['Energy', 'Industry', 'Transport', 'Buildings', 'Agriculture'],
            datasets: [{
                label: 'CO₂ Emissions by Sector',
                data: [13.6, 8.7, 6.9, 3.3, 4.3],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Global CO₂ Emissions by Sector'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Billion Metric Tons CO₂'
                    }
                }
            }
        }
    });
}

// Initialize FAQ functionality
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.maxHeight;

            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.style.maxHeight = null;
                item.previousElementSibling.classList.remove('active');
            });

            // Toggle current answer
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.classList.add('active');
            }
        });
    });
}

// Initialize tooltips
function initializeTooltips() {
    const buttons = document.querySelectorAll('.info-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const tooltip = button.nextElementSibling;
            tooltip.style.display = 'block';
        });
        button.addEventListener('mouseleave', () => {
            const tooltip = button.nextElementSibling;
            tooltip.style.display = 'none';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start counters
    setInterval(updateCounters, 100); // Update every 100ms for smooth animation
    
    // Initialize country selector
    handleCountrySelect();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize FAQ
    initializeFAQ();
    
    // Initialize tooltips
    initializeTooltips();
});
