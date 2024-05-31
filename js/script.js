document.addEventListener('DOMContentLoaded', function () {
    const weatherInfo = document.getElementById('weather-info');

    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load configuration');
            }
            return response.json();
        })
        .then(config => {
            initApp(config.API_KEY);  // Initialize the application with the API key
        })
        .catch(error => {
            console.error('Error loading config:', error);
            weatherInfo.innerHTML = `<p>Error loading configuration. Please check if the config file is present.</p>`;
        });
});

function initApp(apiKey) {
    const weatherInfo = document.getElementById('weather-info');

    function fetchWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                console.error('Fetching weather failed:', error);
                weatherInfo.innerHTML = `<p>Error fetching weather data!</p>`;
            });
    }

    function displayWeather(data) {
        weatherInfo.innerHTML = `
            <h3>Weather in ${data.name}, ${data.sys.country}</h3>
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind:</strong> ${data.wind.speed} m/s, ${data.wind.deg} degrees</p>
            <p><strong>Cloudiness:</strong> ${data.clouds.all}%</p>
            <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
        `;
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    alert('Geolocation is not supported by this browser or it is not enabled.');
                    // Provide a default location or let the user input manually
                    fetchWeather(48.1371, 11.5754); // Default to Munich
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            // Fall back to default coordinates or manual input
            fetchWeather(48.1371, 11.5754); // Default to Munich
        }
    }

    document.getElementById('fetch-weather-btn').addEventListener('click', function() {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;
        fetchWeather(lat, lon);
    });

    // Automatically fetch weather based on geolocation when page loads
    getLocation();
}