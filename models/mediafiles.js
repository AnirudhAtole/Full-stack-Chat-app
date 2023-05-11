const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Mediafiles = sequelize.define('mediafile',{
    id :{
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    url :{
        type : Sequelize.STRING,
        allowNull : false
    },
    filename :{
        type : Sequelize.STRING,
        allowNull : false
    },
    groupId:{
        type : Sequelize.INTEGER,
        allowNull : false,
    },
});

module.exports = Mediafiles;