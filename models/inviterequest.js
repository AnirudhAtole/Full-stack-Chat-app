const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const inviterequest = sequelize.define('inviterequest',{
    id :{
        type : Sequelize.STRING,
        allowNull : false,
        primaryKey : true
    },

    senderName:{
        type : Sequelize.STRING,
        allowNull : false,
    },

    groupName :{
        type: Sequelize.STRING,
        allowNull : false
    },

    groupId : {
        type : Sequelize.INTEGER,
        allowNull : false
    },

    email : {
        type : Sequelize.INTEGER,
        allowNull : false,
    },

    status : {
        type : Sequelize.BOOLEAN,
        allowNull: false,
    }

});

module.exports = inviterequest;