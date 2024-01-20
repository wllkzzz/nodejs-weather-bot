

## Description
WeatherBot is a Telegram bot that provides current weather information based on user requests and sends daily weather updates to subscribed users.

## Features
- **Current Weather:** Users can get the current weather for a specific city by sending the city name to the bot.
- **Subscription:** Users can subscribe to daily weather updates for a specific city.
- **Unsubscription:** Users can unsubscribe from daily weather updates.
- **Scheduled Updates:** The bot sends daily weather updates to subscribed users at a specified time.

## Technologies Used
- Node.js
- Telegram Bot API
- Sequelize (ORM for PostgreSQL)
- node-schedule
- OpenWeatherMap API

## Usage

1. Start the bot by sending the "/start" command to get a welcome message.

2. Send the name of your city to receive the current weather information.

3. Subscribe to daily weather updates for a specific city using the "/subscribe" command followed by the city name.

4. Unsubscribe from daily weather updates using the "/unsubscribe" command.
