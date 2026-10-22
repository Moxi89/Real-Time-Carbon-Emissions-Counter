document.addEventListener('DOMContentLoaded', function() {
    // Constants for emissions counter
    const EMISSIONS_PER_YEAR = 41.6; // Gt CO₂ per year
    const CARBON_BUDGET_START = 200; // Gt CO₂ in 2024
    const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
    const EMISSIONS_PER_SECOND = (EMISSIONS_PER_YEAR * 1e9) / SECONDS_PER_YEAR; // tons of CO₂ (~1,318)
    const pageLoadTime = new Date(); // When the page was loaded
    const currentYear = pageLoadTime.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year

    const perSecondElement = document.getElementById('emissionsPerSecond');
    if (perSecondElement) perSecondElement.textContent = Math.round(EMISSIONS_PER_SECOND).toLocaleString('en-US');

    // Show the current year wherever the page refers to it
    ['currentYear', 'yearReference', 'copyrightYear'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentYear;
    });

    // Country emissions data (percentage of global emissions)
    const countryEmissionsData = {
        china: {
            percentage: 32.88,
            info: '32.88% of global emissions'
        },
        us: {
            percentage: 12.60,
            info: '12.60% of global emissions'
        },
        india: {
            percentage: 7.02,
            info: '7.02% of global emissions'
        },
        russia: {
            percentage: 4.71,
            info: '4.71% of global emissions'
        },
        japan: {
            percentage: 2.99,
            info: '2.99% of global emissions'
        },
        germany: {
            percentage: 1.85,
            info: '1.85% of global emissions'
        },
        iran: {
            percentage: 1.83,
            info: '1.83% of global emissions'
        },
        skorea: {
            percentage: 1.80,
            info: '1.80% of global emissions'
        },
        saudi: {
            percentage: 1.70,
            info: '1.70% of global emissions'
        },
        indonesia: {
            percentage: 1.65,
            info: '1.65% of global emissions'
        }
    };

    // Get counter elements
    const totalEmissionsElement = document.getElementById('totalEmissions');
    const yearlyEmissionsElement = document.getElementById('yearlyEmissions');
    const timeAgoElement = document.getElementById('timeAgo');
    const countryEmissionsElement = document.getElementById('countryEmissions');
    const countryInfoElement = document.getElementById('countryInfo');
    const countrySelect = document.getElementById('countrySelect');

    let startTime;

    // Whole number with thousands separators, e.g. 3,284
    function formatNumber(num) {
        return Math.round(num).toLocaleString('en-US');
    }

    // Counters update every frame, so show the true value directly
    function setCounter(element, value) {
        element.textContent = formatNumber(value);
    }

    // Special formatting for carbon budget (keeping one decimal place)
    function formatBudgetNumber(num) {
        return Math.round(num * 10) / 10;
    }

    function updateEmissions() {
        const currentTime = performance.now();
        const elapsedSeconds = (currentTime - startTime) / 1000;
        const totalEmissions = EMISSIONS_PER_SECOND * elapsedSeconds;
        
        // Update total emissions since page load
        setCounter(totalEmissionsElement, totalEmissions);
        
        // Calculate and update yearly emissions
        const yearlyElapsedSeconds = (Date.now() - startOfYear) / 1000;
        const yearlyEmissions = EMISSIONS_PER_SECOND * yearlyElapsedSeconds;
        setCounter(yearlyEmissionsElement, yearlyEmissions);
        
        // Update country emissions
        const selectedCountry = countrySelect.value;
        const countryData = countryEmissionsData[selectedCountry];
        const countryEmissions = (totalEmissions * countryData.percentage) / 100;
        
        setCounter(countryEmissionsElement, countryEmissions);
        countryInfoElement.textContent = `${countryData.percentage}% of global emissions`;
    }

    function updateTimeAgo() {
        const currentTime = new Date();
        const pageLoadSecondsElapsed = (currentTime - pageLoadTime) / 1000;
        const seconds = Math.floor(pageLoadSecondsElapsed);
        const text = seconds === 1 ? 'second' : 'seconds';
        timeAgoElement.textContent = `${seconds} ${text} ago`;
    }

    // Carbon Budget Counter Logic
    function updateCarbonBudgetCounter() {
        const startDate = new Date('2024-01-01').getTime();
        const elapsedTime = Date.now() - startDate;
        
        // Calculate remaining budget with high precision
        const emissionsPerMs = EMISSIONS_PER_YEAR / (SECONDS_PER_YEAR * 1000);
        const emittedSoFar = elapsedTime * emissionsPerMs;
        const remainingBudget = Math.max(0, CARBON_BUDGET_START - emittedSoFar);
        
        // Calculate percentage used
        const percentageUsed = ((CARBON_BUDGET_START - remainingBudget) / CARBON_BUDGET_START) * 100;
        
        // Update budget display
        const budgetElement = document.getElementById('carbon-budget-counter');
        budgetElement.textContent = formatBudgetNumber(remainingBudget);
        
        // Update progress bar and percentage
        const progressBar = document.getElementById('carbon-budget-progress');
        progressBar.style.width = `${percentageUsed}%`;
        document.getElementById('budget-percentage').textContent = `${Math.round(percentageUsed)}% used`;
        
        // Update years remaining
        const yearsRemaining = remainingBudget / EMISSIONS_PER_YEAR;
        document.getElementById('budget-years-remaining').textContent = Math.max(0, Math.round(yearsRemaining * 10) / 10);
    }

    // Update all counters once per animation frame
    function updateCounters() {
        updateEmissions();
        updateTimeAgo();
        updateCarbonBudgetCounter();
        requestAnimationFrame(updateCounters);
    }

    // Initialize everything when the page loads
    startTime = performance.now();
    
    // Initial update
    updateEmissions();
    updateTimeAgo();
    updateCarbonBudgetCounter();
    
    // Start the animation loop
    requestAnimationFrame(updateCounters);

    // Handle country selection change
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        const countryData = countryEmissionsData[selectedCountry];
        countryInfoElement.textContent = countryData.info;
        updateEmissions();
    });

    // Initialize country info
    countryInfoElement.textContent = countryEmissionsData[countrySelect.value].info;

    // Chart Data
    const countryData = {
        labels: [
            'China',
            'United States',
            'India',
            'Russia',
            'Japan',
            'Indonesia',
            'Iran',
            'Germany',
            'Saudi Arabia',
            'South Korea'
        ],
        datasets: [{
            label: 'CO₂ Emissions (million tons)',
            data: [12667, 4853, 2693, 1909, 1083, 729, 691, 673, 663, 636],
            backgroundColor: [
                'rgba(74, 226, 144, 0.8)',
                'rgba(74, 226, 144, 0.75)',
                'rgba(74, 226, 144, 0.7)',
                'rgba(74, 226, 144, 0.65)',
                'rgba(74, 226, 144, 0.6)',
                'rgba(74, 226, 144, 0.55)',
                'rgba(74, 226, 144, 0.5)',
                'rgba(74, 226, 144, 0.45)',
                'rgba(74, 226, 144, 0.4)',
                'rgba(74, 226, 144, 0.35)'
            ],
            borderColor: 'rgba(74, 226, 144, 1)',
            borderWidth: 1
        }]
    };

    const productData = {
        labels: [
            'Laptop Computer',
            'Refrigerator',
            'Smartphone',
            'Beef (per kg)',
            'Car Tire',
            'Jeans',
            'Cotton T-shirt',
            'Bread (per loaf)',
            'Plastic Water Bottle'
        ],
        datasets: [{
            label: 'CO₂ Emissions (kg)',
            data: [350, 100, 65, 60, 30, 25, 6.5, 0.7, 0.1],
            backgroundColor: [
                'rgba(74, 226, 144, 0.8)',
                'rgba(74, 226, 144, 0.75)',
                'rgba(74, 226, 144, 0.7)',
                'rgba(74, 226, 144, 0.65)',
                'rgba(74, 226, 144, 0.6)',
                'rgba(74, 226, 144, 0.55)',
                'rgba(74, 226, 144, 0.5)',
                'rgba(74, 226, 144, 0.45)',
                'rgba(74, 226, 144, 0.4)'
            ],
            borderColor: 'rgba(74, 226, 144, 1)',
            borderWidth: 1
        }]
    };

    const cityData = {
        labels: [
            'Shanghai, China',
            'Tokyo, Japan',
            'New York City, USA',
            'Houston, USA',
            'Seoul, South Korea',
            'Guangzhou, China',
            'Los Angeles, USA',
            'Hong Kong, China',
            'Chicago, USA',
            'Singapore'
        ],
        datasets: [{
            label: 'CO₂ Emissions (Million Metric Tons)',
            data: [275.28, 250, 160, 150, 142, 130, 120, 110, 100, 90],
            backgroundColor: [
                'rgba(74, 226, 144, 0.8)',
                'rgba(74, 226, 144, 0.75)',
                'rgba(74, 226, 144, 0.7)',
                'rgba(74, 226, 144, 0.65)',
                'rgba(74, 226, 144, 0.6)',
                'rgba(74, 226, 144, 0.55)',
                'rgba(74, 226, 144, 0.5)',
                'rgba(74, 226, 144, 0.45)',
                'rgba(74, 226, 144, 0.4)',
                'rgba(74, 226, 144, 0.35)'
            ],
            borderColor: 'rgba(74, 226, 144, 1)',
            borderWidth: 1
        }]
    };

    // Chart Configuration
    const chartConfig = {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 35, 50, 0.95)',
                    titleColor: '#4AE290',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x;
                            const datasetLabel = context.dataset.label;
                            return `${datasetLabel}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    };

    // Initialize Charts
    // Skip charts if Chart.js failed to load, so the rest of the page keeps working
    if (typeof Chart !== 'undefined') {
        const charts = document.querySelectorAll('.chart-container canvas');
        new Chart(charts[0], { ...chartConfig, data: countryData });
        new Chart(charts[1], { ...chartConfig, data: productData });
        new Chart(charts[2], { ...chartConfig, data: cityData });
    }

    // Info tooltips: hover shows them (CSS); tap, click or Enter toggles them
    const infoButtons = document.querySelectorAll('.info-button');

    function closeTooltips(except) {
        infoButtons.forEach(button => {
            if (button === except) return;
            button.setAttribute('aria-expanded', 'false');
            const tooltip = button.nextElementSibling;
            if (tooltip) tooltip.classList.remove('show');
        });
    }

    infoButtons.forEach(button => {
        const tooltip = button.nextElementSibling;
        if (!tooltip || !tooltip.classList.contains('info-tooltip')) return;
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTooltips(button);
            const open = tooltip.classList.toggle('show');
            button.setAttribute('aria-expanded', String(open));
        });
    });

    document.addEventListener('click', () => closeTooltips());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeTooltips();
    });

    // Chart Navigation
    let currentChartIndex = 0;
    const chartContainers = document.querySelectorAll('.chart-container');
    const chartTitles = document.querySelectorAll('.chart-title');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const chartDots = document.querySelector('.chart-dots');

    // Create navigation dots
    chartContainers.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showChart(index));
        chartDots.appendChild(dot);
    });

    function updateChartVisibility() {
        chartContainers.forEach((chart, index) => {
            chart.style.display = index === currentChartIndex ? 'block' : 'none';
        });
        chartTitles.forEach((title, index) => {
            title.hidden = index !== currentChartIndex;
        });
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentChartIndex);
        });
        // Update button states
        prevButton.classList.toggle('disabled', currentChartIndex === 0);
        nextButton.classList.toggle('disabled', currentChartIndex === chartContainers.length - 1);
    }

    function showChart(index) {
        currentChartIndex = index;
        updateChartVisibility();
    }

    prevButton.addEventListener('click', () => {
        if (currentChartIndex > 0) {
            currentChartIndex--;
            updateChartVisibility();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentChartIndex < chartContainers.length - 1) {
            currentChartIndex++;
            updateChartVisibility();
        }
    });

    // Initialize first chart
    updateChartVisibility();

    // FAQ Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Simple Menu Toggle
    const menuBtn = document.querySelector('.nav-toggle');
    const menuItems = document.querySelector('.nav-items');

    if (menuBtn && menuItems) {
        const setMenu = (open) => {
            menuItems.classList.toggle('show', open);
            menuBtn.classList.toggle('active', open);
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            setMenu(!menuItems.classList.contains('show'));
        });

        // Close menu when clicking a link
        menuItems.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        // Close menu when clicking outside or pressing Escape
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuItems.contains(e.target)) setMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    // Add smooth scrolling behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
