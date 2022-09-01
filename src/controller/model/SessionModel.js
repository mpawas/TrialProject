const User = require('./UserModel')
const Sequelize = require('sequelize')
const db = require('../database/db')
const { ForeignKeyConstraintError } = require('sequelize')


const Session = db.define('Session', {
    user:{
        type: Sequelize.INTEGER,
        references:{
            model:'User',
            key:'username'
        }
    },
    device:{
        type: Sequelize.STRING,
        allowNull: false
    }
   

},{
    tableName: 'Session'
})


Session.sync({alter:true})

Session.belongsTo(User, {
    foreignKey: 'user'

})
User.hasOne(Session ,{
    foreignKey:'user'
}) 

module.exports = Session
