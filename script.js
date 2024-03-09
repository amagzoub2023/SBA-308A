//  -----------------  Weather APP -------------------------------
// Main function that retrieved weather data for a given city from 
// Openweathermap.com - site does not support any data manipulation
//-----------------------------------------------------------------

async function getWeather() {
    const apiKey = 'b760fd0ab7ff647159c9893f2a5791c7'
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Use the fetch API or Axios to communicate with an external web API. Use the
    // data provided by this API to populate your application’s content and
    // features.

    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        displayWeather(currentWeatherData);
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        alert('Error fetching current weather data. Please try again.');
    }

    // Create user interaction with the API through a search feature. This feature
    //should use GET requests to retrieve associated data.

    try {
        const forecastRequest = new XMLHttpRequest();
        forecastRequest.open('GET', forecastUrl, true);

        forecastRequest.onload = function () {
            if (forecastRequest.status >= 200 && forecastRequest.status < 400) {
                const data = JSON.parse(forecastRequest.responseText);
                displayHourlyForecast(data.list);
            } else {
                console.error('Error fetching hourly forecast data:', forecastRequest.statusText);
                alert('Error fetching hourly forecast data. Please try again.');
            }
        };

        forecastRequest.onerror = function () {
            console.error('Error fetching hourly forecast data:', forecastRequest.statusText);
            alert('Error fetching hourly forecast data. Please try again.');
        };

        forecastRequest.send();
    } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data. Please try again.');
    }



}

// Display current weather data on the page
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

// Display weather forecast data on the page
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Display the next 24 hours (3-hour intervals)
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        // convert time to milliseconds        
        const dateTime = new Date(item.dt * 1000);

        const hour = dateTime.getHours();

        // Convert to Celsius
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Display weather icon image
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
