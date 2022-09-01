const { STRING, INTEGER } = require('sequelize')
const db = require('../database/db')

const ContactUS = db.define('ContactUs', {
    name: {
        type: STRING,
        allowNull:false
    },
    email: { 
        type: STRING,
        allowNull: false 
    },
    phone: {
        type: STRING,
        allowNull: false
    },
    message: {
        type: STRING,
        allowNull: false
    },
    subject:{
        type:STRING,
        allowNull:false,
    }

}, {
    tableName: 'ContactUs'
})

ContactUS.sync({ alter: true })



module.exports = ContactUS