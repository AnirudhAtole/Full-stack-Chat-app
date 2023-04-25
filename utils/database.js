let Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.SCHEMA , process.env.DB_USER , process.env.DB_PASSWORD , {dialect : process.env.DIALECT , host : process.env.HOST})

module.exports = sequelize;