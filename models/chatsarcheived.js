const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Archeivedchats = sequelize.define('archievedchats',{
    id :{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    chatmessages : {
        type : Sequelize.STRING,
        allowNull : false
    },
});

module.exports = Archeivedchats;