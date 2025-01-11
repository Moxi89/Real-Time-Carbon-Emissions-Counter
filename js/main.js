// Constants for emissions calculations
const YEARLY_EMISSIONS = 36.8; // Billion tonnes of CO2 in 2023
const DAILY_EMISSIONS = YEARLY_EMISSIONS / 365;
const HOURLY_EMISSIONS = DAILY_EMISSIONS / 24;
const MINUTE_EMISSIONS = HOURLY_EMISSIONS / 60;
const SECOND_EMISSIONS = MINUTE_EMISSIONS / 60;

// Carbon budget constants (in billion tonnes)
const CARBON_BUDGET_2020 = 400; // Approximate remaining carbon budget from 2020
const YEARLY_REDUCTION_RATE = YEARLY_EMISSIONS; // Yearly reduction in carbon budget

// Initialize counters
let yearlyCounter = 0;
let carbonBudgetCounter = CARBON_BUDGET_2020;
const startTime = new Date();

// Update counters
function updateCounters() {
    const currentTime = new Date();
    const elapsedSeconds = (currentTime - startTime) / 1000;
    
    // Calculate emissions since page load
    yearlyCounter = elapsedSeconds * SECOND_EMISSIONS;
    
    // Calculate remaining carbon budget
    const yearsSinceStart = elapsedSeconds / (365 * 24 * 60 * 60);
    carbonBudgetCounter = CARBON_BUDGET_2020 - (yearsSinceStart * YEARLY_REDUCTION_RATE);

    // Update display
    document.getElementById('yearly-counter').textContent = yearlyCounter.toFixed(8);
    document.getElementById('carbon-budget').textContent = carbonBudgetCounter.toFixed(8);
}

// Initialize charts
function initializeCharts() {
    // Country Emissions Chart
    const countryCtx = document.querySelector('#countryChart canvas').getContext('2d');
    new Chart(countryCtx, {
        type: 'bar',
        data: {
            labels: ['China', 'USA', 'India', 'Russia', 'Japan'],
            datasets: [{
                label: 'CO₂ Emissions (Billion Tonnes)',
                data: [10.5, 5.1, 2.7, 1.7, 1.1],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Billion Tonnes CO₂'
                    }
                }
            }
        }
    });

    // Product Emissions Chart
    const productCtx = document.querySelector('#productChart canvas').getContext('2d');
    new Chart(productCtx, {
        type: 'bar',
        data: {
            labels: ['Electricity', 'Transport', 'Industry', 'Buildings', 'Agriculture'],
            datasets: [{
                label: 'CO₂ Emissions by Sector',
                data: [13.6, 8.7, 6.9, 3.3, 4.3],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Billion Tonnes CO₂'
                    }
                }
            }
        }
    });
}

// FAQ Functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.maxHeight;

            // Close all other answers
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start counters
    setInterval(updateCounters, 100); // Update every 100ms for smooth animation
    
    // Initialize charts
    initializeCharts();
    
    // Initialize FAQ
    initializeFAQ();
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
});
