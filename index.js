const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const token = process.env.TOKEN;
const apiToken = process.env.API_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const getWeather = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiToken}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }

}

const get5DayForecast = async () => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiToken}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      console.log('5 Day Forecast:', data);
    } catch (error) {
      console.error('Error fetching 5 day forecast:', error);
    }
  };

const start = async () => {


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;


        try {
            if(text === '/start') {
                return bot.sendMessage(chatId, 'Welcome, send the name of your city to get the weather.')
            }
        } catch (error) {
            return bot.sendMessage(chatId, "Something went wrong, try again.")
        }
    })


}

start()