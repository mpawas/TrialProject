const Sequelize = require('sequelize')
const db = require('../database/db')
const bcrypt = require('bcrypt')
const { ForeignKeyConstraintError } = require('sequelize')
const Category = require('./CategoryModel')

const SubCategory = db.define('SubCategory', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    categoryId:{
        type:Sequelize.INTEGER,
        references:{
            model:Category,
            key: 'id'
        },
        onDelete:"CASCADE",

    },
    uid:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull:true,
    },
},{
    tableName: 'SubCategory'
})

SubCategory.sync({alter:false})

Category.hasOne(SubCategory, {
    foreignKey: 'categoryId',

})

SubCategory.belongsTo(Category, {
    foreignKey:'categoryId',
})

module.exports = SubCategory
