document.addEventListener('DOMContentLoaded', function() {
    // Constants for emissions counter
    const FPS = 60;
    const FRAME_INTERVAL = 1000 / FPS; // 16.67ms for 60fps
    const EMISSIONS_PER_YEAR = 42.2; // Gt CO₂ per year, fossil + land use (Global Carbon Budget 2025)
    const CARBON_BUDGET_START = 170; // Gt CO₂ left for 1.5°C at 50% likelihood, on the reference date below
    const BUDGET_REFERENCE_DATE = Date.UTC(2026, 0, 1); // Global Carbon Budget 2025 counts from 1 January 2026
    const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
    // Date the budget runs out at the current emission rate (~early 2030)
    const BUDGET_DEPLETION_DATE = new Date(BUDGET_REFERENCE_DATE + (CARBON_BUDGET_START / EMISSIONS_PER_YEAR) * MS_PER_YEAR);
    const EMISSIONS_PER_SECOND = 1100; // tons of CO₂
    const UPDATE_INTERVAL = 50; // milliseconds
    const pageLoadTime = new Date(); // When the page was loaded

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

    let lastFrameTime = 0;
    let startTime;
    let accumulatedTime = 0;

    function formatNumber(num) {
        // Round to the nearest integer
        num = Math.round(num);
        
        if (num >= 1000000) {
            // For numbers >= 1 million, format with commas
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            // For smaller numbers, just return the integer
            return num.toString();
        }
    }

    function formatNumberWithAnimation(element, value) {
        const currentValue = parseFloat(element.textContent.replace(/,/g, '')) || 0;
        const diff = value - currentValue;
        const step = diff / (FPS / 4); // Smooth transition over 1/4 second
        
        element.textContent = formatNumber(currentValue + step);
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
        formatNumberWithAnimation(totalEmissionsElement, totalEmissions);
        
        // Calculate and update emissions since January 1st of the current year
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const yearlyElapsedSeconds = (Date.now() - yearStart) / 1000;
        const yearlyEmissions = EMISSIONS_PER_SECOND * yearlyElapsedSeconds;
        formatNumberWithAnimation(yearlyEmissionsElement, yearlyEmissions);
        
        // Update country emissions
        const selectedCountry = countrySelect.value;
        const countryData = countryEmissionsData[selectedCountry];
        const countryEmissions = (totalEmissions * countryData.percentage) / 100;
        
        formatNumberWithAnimation(countryEmissionsElement, countryEmissions);
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
        const elapsedTime = Date.now() - BUDGET_REFERENCE_DATE;

        // Calculate remaining budget with high precision
        const emissionsPerMs = EMISSIONS_PER_YEAR / MS_PER_YEAR;
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

    // Fill in year labels so they never go stale
    function updateDateLabels() {
        const year = String(new Date().getFullYear());
        const depletionYear = String(BUDGET_DEPLETION_DATE.getUTCFullYear());
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        setText('currentYear', year);
        setText('yearReference', year);
        setText('copyright-year', year);
        setText('budget-start-label', `${new Date(BUDGET_REFERENCE_DATE).getUTCFullYear()} (${CARBON_BUDGET_START} Gt)`);
        setText('budget-end-label', `${depletionYear} (0 Gt)`);
        setText('budget-depletion-year', depletionYear);
        setText('budget-rate', String(EMISSIONS_PER_YEAR));
    }
    updateDateLabels();

    // Update all counters with precise timing
    function updateCounters(currentTime) {
        if (!lastFrameTime) lastFrameTime = currentTime;
        
        const deltaTime = currentTime - lastFrameTime;
        accumulatedTime += deltaTime;
        
        // Update at fixed time steps for smooth animation
        while (accumulatedTime >= FRAME_INTERVAL) {
            updateEmissions();
            updateTimeAgo();
            updateCarbonBudgetCounter();
            accumulatedTime -= FRAME_INTERVAL;
        }
        
        lastFrameTime = currentTime;
        requestAnimationFrame(updateCounters);
    }

    // Initialize everything when the page loads
    startTime = performance.now();
    lastFrameTime = startTime;
    
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
                'rgba(52, 211, 153, 0.8)',
                'rgba(52, 211, 153, 0.75)',
                'rgba(52, 211, 153, 0.7)',
                'rgba(52, 211, 153, 0.65)',
                'rgba(52, 211, 153, 0.6)',
                'rgba(52, 211, 153, 0.55)',
                'rgba(52, 211, 153, 0.5)',
                'rgba(52, 211, 153, 0.45)',
                'rgba(52, 211, 153, 0.4)',
                'rgba(52, 211, 153, 0.35)'
            ],
            borderColor: 'rgba(52, 211, 153, 1)',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 28
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
                'rgba(52, 211, 153, 0.8)',
                'rgba(52, 211, 153, 0.75)',
                'rgba(52, 211, 153, 0.7)',
                'rgba(52, 211, 153, 0.65)',
                'rgba(52, 211, 153, 0.6)',
                'rgba(52, 211, 153, 0.55)',
                'rgba(52, 211, 153, 0.5)',
                'rgba(52, 211, 153, 0.45)',
                'rgba(52, 211, 153, 0.4)'
            ],
            borderColor: 'rgba(52, 211, 153, 1)',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 28
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
                'rgba(52, 211, 153, 0.8)',
                'rgba(52, 211, 153, 0.75)',
                'rgba(52, 211, 153, 0.7)',
                'rgba(52, 211, 153, 0.65)',
                'rgba(52, 211, 153, 0.6)',
                'rgba(52, 211, 153, 0.55)',
                'rgba(52, 211, 153, 0.5)',
                'rgba(52, 211, 153, 0.45)',
                'rgba(52, 211, 153, 0.4)',
                'rgba(52, 211, 153, 0.35)'
            ],
            borderColor: 'rgba(52, 211, 153, 1)',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 28
        }]
    };

    // Additional country information for tooltips
    const countryInfo = {
        'China': {
            percentage: '32.88%',
            sources: 'Coal, industrial production, large population'
        },
        'United States': {
            percentage: '12.6%',
            sources: 'Industrial activities, transportation, energy production'
        },
        'India': {
            percentage: '6.99%',
            sources: 'Rapid industrialization and growing energy demands'
        },
        'Russia': {
            percentage: '4.96%',
            sources: 'Significant fossil fuel production and industrial sectors'
        },
        'Japan': {
            percentage: '2.81%',
            sources: 'Industrial manufacturing and energy consumption'
        },
        'Indonesia': {
            percentage: '1.8%',
            sources: 'Deforestation and industrial activities'
        },
        'Iran': {
            percentage: '1.78%',
            sources: 'Fossil fuel-based economy'
        },
        'Germany': {
            percentage: '1.75%',
            sources: 'Industrial manufacturing and energy production'
        },
        'Saudi Arabia': {
            percentage: '1.66%',
            sources: 'Oil production and energy-intensive industries'
        },
        'South Korea': {
            percentage: '1.53%',
            sources: 'Industrial manufacturing and energy consumption'
        }
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
                    backgroundColor: 'rgba(8, 19, 15, 0.97)',
                    borderColor: 'rgba(52, 211, 153, 0.32)',
                    borderWidth: 1,
                    titleColor: '#34d399',
                    bodyColor: '#ecfdf5',
                    titleFont: { family: "'Fira Sans', system-ui, sans-serif", weight: '600' },
                    bodyFont: { family: "'Fira Code', ui-monospace, monospace" },
                    padding: 12,
                    cornerRadius: 10,
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
                        color: 'rgba(52, 211, 153, 0.08)'
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#7f9c91',
                        font: { family: "'Fira Code', ui-monospace, monospace", size: 11 }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#a3bfb4',
                        font: { family: "'Fira Sans', system-ui, sans-serif", size: 13 }
                    }
                }
            }
        }
    };

    // Initialize Charts
    const charts = document.querySelectorAll('.chart-container canvas');
    const countryChart = new Chart(charts[0], {
        ...chartConfig,
        data: countryData
    });

    const productChart = new Chart(charts[1], {
        ...chartConfig,
        data: productData
    });

    const cityChart = new Chart(charts[2], {
        ...chartConfig,
        data: cityData
    });

    // Info tooltips: open on hover, keyboard focus, or tap; close with Escape
    const infoButtons = document.querySelectorAll('.info-button');

    function setTooltip(button, open) {
        const tooltip = button.nextElementSibling;
        if (!tooltip || !tooltip.classList.contains('info-tooltip')) return;
        tooltip.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
    }

    function closeAllTooltips(except) {
        infoButtons.forEach(other => {
            if (other !== except) setTooltip(other, false);
        });
    }

    infoButtons.forEach(button => {
        button.addEventListener('mouseenter', () => { closeAllTooltips(button); setTooltip(button, true); });
        button.addEventListener('mouseleave', () => setTooltip(button, false));
        button.addEventListener('focus', () => { closeAllTooltips(button); setTooltip(button, true); });
        button.addEventListener('blur', () => setTooltip(button, false));
        button.addEventListener('click', (e) => {
            // Hover/focus already opened it, so a click (or tap) only keeps it open;
            // clicking elsewhere or pressing Escape closes it
            e.stopPropagation();
            closeAllTooltips(button);
            setTooltip(button, true);
        });
    });

    document.addEventListener('click', () => closeAllTooltips());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllTooltips();
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
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Show chart ${index + 1} of ${chartContainers.length}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showChart(index));
        chartDots.appendChild(dot);
    });

    function updateChartVisibility() {
        chartContainers.forEach((chart, index) => {
            chart.style.display = index === currentChartIndex ? 'block' : 'none';
        });
        chartTitles.forEach((title, index) => {
            title.style.display = index === currentChartIndex ? '' : 'none';
        });
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentChartIndex);
            dot.setAttribute('aria-current', index === currentChartIndex ? 'true' : 'false');
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
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            // Toggle current item
            const isOpen = item.classList.toggle('active');
            question.setAttribute('aria-expanded', String(isOpen));
        });
    });

    // Simple Menu Toggle
    const menuBtn = document.querySelector('.nav-toggle');
    const menuItems = document.querySelector('.nav-items');

    function setMenu(open) {
        menuBtn.classList.toggle('active', open);
        menuItems.classList.toggle('show', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (menuBtn && menuItems) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            setMenu(!menuItems.classList.contains('show'));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuItems.classList.contains('show')) {
                setMenu(false);
                menuBtn.focus();
            }
        });

        // Close menu when clicking a link
        const menuLinks = menuItems.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuItems.contains(e.target)) {
                setMenu(false);
            }
        });

        // Prevent menu from closing when clicking inside it
        menuItems.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click from reaching the document
        });
    }

    // Add smooth scrolling behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                targetElement.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
