const Sequelize = require('sequelize')
const db = require('../database/db')
const bcrypt = require('bcrypt')
const { ForeignKeyConstraintError } = require('sequelize')
const User = require('./UserModel')
const Category = require('./CategoryModel')
const SubCategory = require('./SubcategoryModel')

const Product = db.define('Product', {
    name:{
        type: Sequelize.STRING,
        allowNull: true
    },
    uid:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    user:{
        type:Sequelize.INTEGER,
        references:{
            model:User,
            key: 'id'
        },
    },
    category:{
        type:Sequelize.INTEGER,
        references:{
            model:Category,
            key: 'id'
        },
    },
    subcategory:{
        type:Sequelize.INTEGER,
        references:{
            model:SubCategory,
            key: 'id'
        },
    },  
    author:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    description:{
        type:Sequelize.STRING(2000),
        allowNull:true,
    },
    baseprice:{
        type:Sequelize.FLOAT,
        allowNull:true,
    },
    price:{
        type:Sequelize.FLOAT,
        allowNull:true,
    },
    discount:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
    },
    discount_percent:{
        type: Sequelize.FLOAT,
        allowNull:true
    },
    publication:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue: false
    },
    published_year:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    file:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    exchange:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull:true
    },
    view:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
   
},{
    tableName: 'Product'
})

Product.sync({alter:true})

User.hasOne(Product, {
    foreignKey: 'user'

})


Product.belongsTo(User,{
    foreignKey:'user'
})

Category.hasMany(Product, {
    foreignKey: 'category'

})

Product.belongsTo(Category,{
    foreignKey:'category'
})

SubCategory.hasMany(Product, {
    foreignKey: 'subcategory'

})

Product.belongsTo(SubCategory,{
    foreignKey:'subcategory'
})



module.exports = Product
