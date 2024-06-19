const sequelize = require("sequelize");
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("auth_sequelize","root","",{
    dialect:"mysql",
    host:"localhost",
})

module.exports = sequelize;