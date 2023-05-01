const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Admin = sequelize.define('admin',{
    id :{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    adminName : {
        type : Sequelize.STRING,
        allowNull : false
    },
});

module.exports = Admin;