const Sequelize = require('sequelize')
const db = require('../database/db')
const Product = require('./ProductModel')
const User = require('./UserModel')



const Chat = db.define('Chat', {
    message:{
        type: Sequelize.STRING,
        allowNull: true
    },
    fromUser:{
        type: Sequelize.INTEGER,
        references:{
            model:User,
            key:'id'
        }
    },
    toUser: {
        type: Sequelize.STRING,
        allowNull:true,
    },
    seen:{
        type:Sequelize.INTEGER,
        references:{
            model:Product,
            key:'id'
        }
    },
    reply: {
        typ:Sequelize.STRING,
        references:{
            
        }
    }

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
