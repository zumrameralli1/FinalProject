// Weather API Integration (OpenWeatherMap)

// API configuration
const WEATHER_API_KEY = '923c984cd9e7bac4f0ab46ab8c3c8df9'; // Free API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get user's location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    console.warn('Geolocation error:', error);
                    // Default to Istanbul if location access denied
                    resolve({ lat: 41.0082, lon: 28.9784 });
                }
            );
        } else {
            // Default to Istanbul
            resolve({ lat: 41.0082, lon: 28.9784 });
        }
    });
}

// Fetch weather data
async function fetchWeather() {
    try {
        const location = await getUserLocation();
        
        const url = `${WEATHER_API_URL}?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=tr`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError();
    }
}

// Display weather information
function displayWeather(data) {
    const weatherText = document.getElementById('weatherText');
    
    if (!weatherText) return;
    
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const city = data.name;
    const icon = getWeatherIcon(data.weather[0].main);
    
    weatherText.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${city}: ${temp}°C - ${description}</span>
    `;
}

// Display weather error
function displayWeatherError() {
    const weatherText = document.getElementById('weatherText');
    
    if (!weatherText) return;
    
    weatherText.innerHTML = `
        <i class="fas fa-cloud"></i>
        <span>Hava durumu yüklenemedi</span>
    `;
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'sun',
        'Clouds': 'cloud',
        'Rain': 'cloud-rain',
        'Drizzle': 'cloud-rain',
        'Thunderstorm': 'bolt',
        'Snow': 'snowflake',
        'Mist': 'smog',
        'Smoke': 'smog',
        'Haze': 'smog',
        'Dust': 'smog',
        'Fog': 'smog',
        'Sand': 'smog',
        'Ash': 'smog',
        'Squall': 'wind',
        'Tornado': 'tornado'
    };
    
    return iconMap[condition] || 'cloud';
}

// Initialize weather on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only load weather on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        fetchWeather();
    }
});