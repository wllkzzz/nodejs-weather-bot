const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TOKEN;
const apiToken = process.env.API_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const getCurrentWeather = async (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiToken}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      return formatWeatherData(data);
    } else {
      throw new Error(`City not found: ${city}`);
    }
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Something went wrong while fetching weather data.');
  }
};

const formatWeatherData = (data) => {
  const cityName = data.name;
  const temperature = data.main.temp; 
  const temperatureCelsius = temperature - 273.15;
  const weatherDescription = data.weather[0].description;

  return `Current weather in ${cityName}:\nTemperature: ${temperatureCelsius.toFixed(1)}°C\nDescription: ${weatherDescription}`;
};

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === '/start') {
        return bot.sendMessage(chatId, 'Welcome, send the name of your city to get the weather.');
      }

      if (text) {
        try {
          const weatherData = await getCurrentWeather(text);
          return bot.sendMessage(chatId, weatherData);
        } catch (error) {
          return bot.sendMessage(chatId, error.message || 'Error fetching weather data.');
        }
      }
    } catch (error) {
      return bot.sendMessage(chatId, 'Something went wrong, try again.');
    }
  });
};

start();
