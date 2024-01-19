const sequilize = require('./db');
const { DataTypes } = require('sequelize');


const User =  sequilize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    city: {type: DataTypes.STRING, defaultValue: null},
    subscribed: {type: DataTypes.BOOLEAN, defaultValue: false}
})

module.exports = User;