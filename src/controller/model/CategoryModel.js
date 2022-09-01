const Sequelize = require('sequelize')
const db = require('../database/db')

const bcrypt = require('bcrypt')
const { ForeignKeyConstraintError } = require('sequelize')

const Category = db.define('Category', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    uid:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    image: {
        type: Sequelize.STRING,
        allowNull:true,
    },
},{
    tableName: 'Category'
})

Category.sync({alter:false})




module.exports = Category