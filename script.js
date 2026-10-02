// ========================================
// ECO-ALIANCE WEATHER APP
// Live Weather using Open-Meteo API
// ========================================

// Search weather when button is clicked
async function searchWeather() {

    const input = document.getElementById("cityInput");
    const cityName = input.value.trim();

    // Check if user entered a city
    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }

    // Show loading message
    document.getElementById("city").textContent = "Loading...";
    document.getElementById("condition").textContent = "Getting weather...";

    try {

        // ========================================
        // STEP 1: Find the city coordinates
        // ========================================

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find location.");
        }

        const locationData = await locationResponse.json();

        // Check if city exists
        if (!locationData.results || locationData.results.length === 0) {

            document.getElementById("city").textContent = "City Not Found";
            document.getElementById("condition").textContent =
                "Please check the city name.";

            return;
        }

        // Get city information
        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const city = location.name;
        const country = location.country;


        // ========================================
        // STEP 2: Get live weather
        // ========================================

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // ========================================
        // STEP 3: Convert weather code to condition
        // ========================================

        const weatherInfo = getWeatherInfo(current.weather_code);


        // ========================================
        // STEP 4: Display weather information
        // ========================================

        document.getElementById("city").textContent =
            `${city}, ${country}`;

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°C";

        document.getElementById("condition").textContent =
            weatherInfo.condition;

        document.getElementById("weatherIcon").textContent =
            weatherInfo.icon;

        document.getElementById("humidity").textContent =
            Math.round(current.relative_humidity_2m) + "%";

        document.getElementById("wind").textContent =
            Math.round(current.wind_speed_10m) + " km/h";

        document.getElementById("feels").textContent =
            Math.round(current.apparent_temperature) + "°C";


        // Update date and time
        updateDateTime();

        // Clear search box
        input.value = "";

    } catch (error) {

        console.error(error);

        document.getElementById("city").textContent =
            "Something went wrong";

        document.getElementById("condition").textContent =
            "Please try again.";

    }
}


// ========================================
// WEATHER CODE FUNCTION
// ========================================

function getWeatherInfo(code) {

    if (code === 0) {
        return {
            condition: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            condition: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            condition: "Cloudy",
            icon: "☁️"
        };
    }

    if (code === 45 || code === 48) {
        return {
            condition: "Foggy",
            icon: "🌫️"
        };
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55
    ) {
        return {
            condition: "Drizzle",
            icon: "🌦️"
        };
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65
    ) {
        return {
            condition: "Rain",
            icon: "🌧️"
        };
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75
    ) {
        return {
            condition: "Snow",
            icon: "❄️"
        };
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return {
            condition: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return {
            condition: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        condition: "Unknown",
        icon: "🌍"
    };
}


// ========================================
// DATE AND TIME
// ========================================

function updateDateTime() {

    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-IN", options);
}


// ========================================
// DEFAULT WEATHER
// ========================================

// Show current weather for Bengaluru
// when the website is opened.

async function loadDefaultWeather() {

    const cityInput = document.getElementById("cityInput");

    cityInput.value = "Bengaluru";

    await searchWeather();

}


// Start the application
updateDateTime();
loadDefaultWeather();