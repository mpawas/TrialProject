const User = require('./UserModel')
const Sequelize = require('sequelize')
const db = require('../database/db')

const ForgetPwd = db.define('ForgetPwd',{
    user:{
        type:Sequelize.STRING,
        references:{
            model:User,
            key:"email",
        },
        unique:true,
        allowNull:false
    },
    token:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{
    tableName:'ForgetPwd'
})

ForgetPwd.sync({alter:false})

ForgetPwd.belongsTo(User,{
    foreignKey: 'user',
})

User.hasOne(ForgetPwd,{
    foreignKey:"user"
})


module.exports = ForgetPwd