document.addEventListener('DOMContentLoaded', function() {
    // Constants for emissions counter
    const EMISSIONS_PER_SECOND = 1100; // tons of CO₂
    const UPDATE_INTERVAL = 10; // milliseconds
    const pageLoadTime = new Date(); // When the page was loaded
    const startOfYear = new Date(2025, 0, 1); // January 1st, 2025

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

    function formatNumber(num) {
        if (num >= 1000000) {
            // For numbers >= 1 million, show 2 decimal places
            return num.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        } else if (num >= 1000) {
            // For numbers >= 1000 but < 1 million, show 1 decimal place
            return num.toLocaleString('en-US', {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
            });
        } else {
            // For smaller numbers, show no decimal places
            return Math.round(num).toLocaleString('en-US');
        }
    }

    function updateEmissions() {
        const currentTime = new Date();
        
        // Calculate total emissions since January 1st, 2025
        const totalSecondsElapsed = (currentTime - startOfYear) / 1000;
        const totalEmissions = EMISSIONS_PER_SECOND * totalSecondsElapsed;
        yearlyEmissionsElement.textContent = formatNumber(totalEmissions);
        
        // Calculate emissions since page load
        const pageLoadSecondsElapsed = (currentTime - pageLoadTime) / 1000;
        const currentEmissions = EMISSIONS_PER_SECOND * pageLoadSecondsElapsed;
        totalEmissionsElement.textContent = formatNumber(currentEmissions);
        
        // Update country-specific emissions based on page load time
        const selectedCountry = countrySelect.value;
        const countryData = countryEmissionsData[selectedCountry];
        const countryEmissions = (currentEmissions * countryData.percentage) / 100;
        countryEmissionsElement.textContent = formatNumber(countryEmissions);
        
        // Update time ago since page load
        const seconds = Math.floor(pageLoadSecondsElapsed);
        const text = seconds === 1 ? 'second' : 'seconds';
        timeAgoElement.textContent = `${seconds} ${text} ago`;
    }

    // Update emissions counter every 10ms for smooth animation
    setInterval(updateEmissions, UPDATE_INTERVAL);

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

    // Info button event listeners
    document.querySelectorAll('.info-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('info-tooltip')) {
                tooltip.style.display = 'block';
            }
        });

        button.addEventListener('mouseleave', function() {
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('info-tooltip')) {
                tooltip.style.display = 'none';
            }
        });
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
            title.style.display = index === currentChartIndex ? 'block' : 'none';
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
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            menuBtn.classList.toggle('active');
            menuItems.classList.toggle('show');
        });

        // Close menu when clicking a link
        const menuLinks = menuItems.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                menuItems.classList.remove('show');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuItems.contains(e.target)) {
                menuBtn.classList.remove('active');
                menuItems.classList.remove('show');
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
