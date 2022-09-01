const Sequelize = require('sequelize')
const db = require('../database/db')
const bcrypt = require('bcrypt')
const { ForeignKeyConstraintError } = require('sequelize')


const User = db.define('User', {
    firstname:{
        type: Sequelize.STRING,
        allowNull: true
    },
    lastname:{
        type: Sequelize.STRING,
        allowNull: true
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    image: {
        type: Sequelize.STRING,
        allowNull:true,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true,
        unique:true,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:true,
        unique:true,
    },
    admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
    },
    password:{
        type: Sequelize.STRING,
    },
    email_verified:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    email_token:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    phone_verified:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    phone_token:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{
    tableName: 'User'
})

User.sync({alter:false})



module.exports = User
