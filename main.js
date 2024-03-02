import { calculateMean, calculateMedian, calculateMode, calculateRange, calculateStandardDeviation } from './statistics.js';

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=60.1695&longitude=24.9354&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FBerlin&past_days=30&forecast_days=0';

    function fetchDataAndPopulateView(parameter, elementId, timespan) {
        let pastDays = 0;
        let dataPoints = 0;
        switch (timespan) {
            case "now":
                dataPoints = 20;
                break;
            case "24_hours":
                pastDays = 1;
                dataPoints = 24;
                break;
            case "48_hours":
                pastDays = 2;
                dataPoints = 48;
                break;
            case "72_hours":
                pastDays = 3;
                dataPoints = 48; // Last 48 hours, average per hour 
                break;
            case "1_week":
                pastDays = 7;
                dataPoints = 168; // Last week, average per hour (7 days * 24 hours)
                break;
            case "1_month":
                pastDays = 30;
                dataPoints = 720; // Last month, average per hour (30 days * 24 hours)
                break;
            default:
                console.error("Invalid timespan provided.");
                return;
        }

        const url = `${apiUrl}&past_days=${pastDays}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const lastData = data.hourly[parameter].slice(-dataPoints);
                const mean = calculateMean(lastData);
                const median = calculateMedian(lastData);
                const mode = calculateMode(lastData);
                const range = calculateRange(lastData);
                const stdDev = calculateStandardDeviation(lastData);
                const min = Math.min(...lastData);
                const max = Math.max(...lastData);

                // Display statistical information
                displayStatistics(parameter, mean, median, mode, range, stdDev, min, max);

                // Populate view
                populateView(lastData, elementId);

                // Create chart based on parameter
                createChart(parameter, lastData, elementId);

                // Display chart
                displayChart(parameter, lastData, elementId);
            })
            .catch((error) =>
                console.error(`Error fetching ${parameter} data:`, error)
            );
    }

    function displayStatistics(parameter, mean, median, mode, range, stdDev, min, max) {
        // Display statistical information for view 3
        if (parameter === "wind_speed_10m") {
            document.getElementById(`mean-wind-speed`).textContent = mean.toFixed(2);
            document.getElementById(`median-wind-speed`).textContent = median.toFixed(2);
            document.getElementById(`mode-wind-speed`).textContent = mode.toFixed(2);
            document.getElementById(`range-wind-speed`).textContent = range.toFixed(2);
            document.getElementById(`std-dev-wind-speed`).textContent = stdDev.toFixed(2);
            document.getElementById(`min-wind-speed`).textContent = min.toFixed(2);
            document.getElementById(`max-wind-speed`).textContent = max.toFixed(2);
        }
        // Display statistical information for view 2
        if (parameter === "relative_humidity_2m") {
            document.getElementById('mean-humidity').textContent = mean.toFixed(2);
            document.getElementById('median-humidity').textContent = median.toFixed(2);
            document.getElementById('mode-humidity').textContent = mode.toFixed(2);
            document.getElementById('range-humidity').textContent = range.toFixed(2);
            document.getElementById('std-dev-humidity').textContent = stdDev.toFixed(2);
            document.getElementById('min-humidity').textContent = min.toFixed(2);
            document.getElementById('max-humidity').textContent = max.toFixed(2);
        }
    }

    function populateView(data, elementId) {
        const valuesContainer = document.getElementById(elementId);
        if (valuesContainer) {
            valuesContainer.innerHTML = "";
            data.forEach((value) => {
                const valueElement = document.createElement("div");
                valueElement.textContent = value.toString();
                valuesContainer.appendChild(valueElement);
            });
        }
    }

    

    // Event listeners for timespan selection
    const timespanSelectors = document.querySelectorAll('.timespan-selector');
    timespanSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const parameter = this.dataset.parameter;
            const elementId = this.dataset.elementId;
            const timespan = this.value;
            fetchDataAndPopulateView(parameter, elementId, timespan);
        });
    });
    

    // Initial fetch and populate
    fetchDataAndPopulateView("temperature_2m", "temperature-values", "now");
    fetchDataAndPopulateView("relative_humidity_2m", "humidity-values", "now");
    fetchDataAndPopulateView("wind_speed_10m", "wind-speed-values", "now");
});
