const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const sequelize = require('./db.js');
const User = require('./models.js');
require('dotenv').config();

const token = process.env.TOKEN;
const apiToken = process.env.API_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Function to fetch current weather data for a given city using OpenWeatherMap API
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

// Function to format weather data into a user-friendly message
const formatWeatherData = (data) => {
  const cityName = data.name;
  const temperature = data.main.temp; 
  const temperatureCelsius = temperature - 273.15;
  const weatherDescription = data.weather[0].description;

  return `Current weather in ${cityName}:\nTemperature: ${temperatureCelsius.toFixed(1)}°C\nDescription: ${weatherDescription}`;
};

const start = async () => {
  try {
    // Authenticate and synchronize the Sequelize database
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }

  // Event listener for incoming messages
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    // Check if the user exists in the database, create if not
    const user = await User.findOne({ chatId });

    if (!user) {
      await User.create({ chatId });
    }

    try {
      // Command handling
      if (text === '/start') {
        return bot.sendMessage(chatId, 'Welcome, send the name of your city to get the weather.');
      }

      if (text.startsWith('/subscribe ')) {
        // Extract the city name from the message
        const cityName = text.replace('/subscribe ', '').trim();

        // Check if there is a city with that name
        try {
          await getCurrentWeather(cityName);

          // Update the subscribed city
          await user.update({
            city: cityName,
            subscribed: true
          });

          // Send confirmation message to the user
          return bot.sendMessage(chatId, `Subscribed to weather updates for ${cityName}`);
        } catch (error) {
          return bot.sendMessage(chatId, `City not found: ${cityName}`);
        }
      }

      // Unsubscribe 
      if (text === '/unsubscribe') {
        await user.update({
          subscribed: false
        });

        return bot.sendMessage(chatId, 'The subscription is canceled');
      }

      // Handle regular text messages by fetching weather data
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

  // Schedule the job outside the event listener to avoid multiple schedules
  schedule.scheduleJob('0 30 7 * * *', async () => {
    // Fetch all users who are subscribed
    const subscribedUsers = await User.findAll({
      where: { subscribed: true }
    });

    // Iterate over subscribed users and send weather updates
    for (const user of subscribedUsers) {
      try {
        const weatherData = await getCurrentWeather(user.city);
        bot.sendMessage(user.chatId, `${weatherData}`);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }
  });
};

start();
