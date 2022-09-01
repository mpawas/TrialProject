const Sequelize = require('sequelize')
const db = require('../database/db')
const Product = require('./ProductModel')
const User = require('./UserModel')



const Review = db.define('Review', {
    review:{
        type: Sequelize.STRING,
        allowNull: true
    },
    user:{
        type: Sequelize.INTEGER,
        references:{
            model:User,
            key:'id'
        }
    },
    ratings: {
        type: Sequelize.STRING,
        allowNull:true,
    },
    product:{
        type:Sequelize.INTEGER,
        references:{
            model:Product,
            key:'id'
        }
    },

},{
    tableName: 'Review'
})


Review.sync({alter:false})

Review.belongsTo(User, {
    foreignKey: 'user'

})
Product.hasMany(Review,{
    foreignKey:"product"
})

Review.belongsTo(Product, {
    foreignKey: 'product'

})

User.hasMany(Review, {
    foreignKey: 'user'

}) 

module.exports = Review
