import { calculateMean, calculateMedian, calculateMode, calculateRange, calculateStandardDeviation } from './statistics.js';
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=60.1695&longitude=24.9354&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FBerlin&past_days=30&forecast_days=0';

    function fetchDataAndPopulateView(parameter, elementId) {
      fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
              const last7DaysData = data.hourly[parameter].slice(-168);
              const mean = calculateMean(last7DaysData);
              const median = calculateMedian(last7DaysData);
              const mode = calculateMode(last7DaysData);
              const range = calculateRange(last7DaysData);
              const stdDev = calculateStandardDeviation(last7DaysData);
              const min = Math.min(...last7DaysData);
              const max = Math.max(...last7DaysData);
          // Display statistical information for view3.html
          if(parameter === "wind_speed_10m"){
            document.getElementById(`mean-wind-speed`).textContent = mean.toFixed(2);
            document.getElementById(`median-wind-speed`).textContent = median.toFixed(2);
            document.getElementById(`mode-wind-speed`).textContent = mode.toFixed(2);
            document.getElementById(`range-wind-speed`).textContent = range.toFixed(2);
            document.getElementById(`std-dev-wind-speed`).textContent = stdDev.toFixed(2);
            document.getElementById(`min-wind-speed`).textContent = min.toFixed(2);
            document.getElementById(`max-wind-speed`).textContent = max.toFixed(2);
          }
            // Display statistical information for view2.html
          if(parameter === "relative_humidity_2m"){
            document.getElementById('mean-humidity').textContent = mean.toFixed(2);
            document.getElementById('median-humidity').textContent = median.toFixed(2);
            document.getElementById('mode-humidity').textContent = mode.toFixed(2);
            document.getElementById('range-humidity').textContent = range.toFixed(2);
            document.getElementById('std-dev-humidity').textContent = stdDev.toFixed(2);
            document.getElementById('min-humidity').textContent = min.toFixed(2);
            document.getElementById('max-humidity').textContent = max.toFixed(2);
          }
            
              const last20Data = data.hourly[parameter].slice(-20);
              populateView(last20Data, elementId);
              if (parameter === "relative_humidity_2m") {
                  createHumidityChart(last20Data, elementId);
              } else if (parameter === "wind_speed_10m") {
                  createWindSpeedChart(last20Data, elementId);
              } else {
                  createDefaultChart(last20Data, elementId);
              }
          })
          .catch((error) =>
              console.error(`Error fetching ${parameter} data:`, error)
          );
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
  
  // Function to create realtive humidity chart
  function createHumidityChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(Array(20).keys()), // Labels for the x-axis (0 to 19)
        datasets: [
          {
            label: "Relative Humidity (%)",
            data: data,
            backgroundColor: "rgba(245, 245, 245, 0.2)",
            borderColor: "rgba(245, 245, 245, 1)",
            borderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Relative Humidity (%)",
            },
          },
        },
      },
    });
  }

  // Function to create wind speed chart
  function createWindSpeedChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(Array(20).keys()), // Labels for the x-axis (0 to 19)
        datasets: [
          {
            label: "Wind Speed (km/h)",
            data: data,
            backgroundColor: "rgba(200, 200, 200, 0.2)",
            borderColor: "rgba(200, 200, 200, 1)",
            borderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Wind Speed (km/h)",
            },
          },
        },
      },
    });
  }

  // Fetch and populate data for each parameter
  fetchDataAndPopulateView("temperature_2m", "temperature-values");
  fetchDataAndPopulateView("relative_humidity_2m", "humidity-values");
  fetchDataAndPopulateView("wind_speed_10m", "wind-speed-values");
  fetchDataAndPopulateView("relative_humidity_2m", "humidity-chart");
  fetchDataAndPopulateView("wind_speed_10m", "wind-speed-chart");
});
