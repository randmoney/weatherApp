const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const showWeatherBtn = document.getElementById('show-weather');
const widgetsContainer = document.getElementById('widgets-container');
const errorMessage = document.getElementById('error-message');

function validateCoordinates(lat, lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
        return { valid: false, message: 'Координаты должны быть числами' };
    }
    
    if (latNum < -90 || latNum > 90) {
        return { valid: false, message: 'Широта должна быть между -90 и 90' };
    }
    
    if (lonNum < -180 || lonNum > 180) {
        return { valid: false, message: 'Долгота должна быть между -180 и 180' };
    }
    
    return { valid: true, lat: latNum, lon: lonNum };
}

async function fetchWeatherData(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    
    if (!response.ok) {
        throw new Error('Ошибка получения данных');
    }
    
    return await response.json();
}

async function showWeather() {
    const lat = latitudeInput.value.trim();
    const lon = longitudeInput.value.trim();
    
    const validation = validateCoordinates(lat, lon);
    if (!validation.valid) {
        errorMessage.textContent = validation.message;
        return;
    }
    
    errorMessage.textContent = '';
    
    try {
        const weatherData = await fetchWeatherData(validation.lat, validation.lon);
        const widget = createWeatherWidget(weatherData, validation.lat, validation.lon);
        widgetsContainer.appendChild(widget);
        latitudeInput.value = '';
        longitudeInput.value = '';
    } catch (error) {
        errorMessage.textContent = 'Произошла ошибка при получении данных';
    }
}

showWeatherBtn.addEventListener('click', showWeather);
latitudeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') showWeather();
});
longitudeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') showWeather();
});