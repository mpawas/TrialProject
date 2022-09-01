const Sequelize = require('sequelize')
const db = require('../database/db')
const Product = require('./ProductModel')



const ProductImage= db.define('ProductImage', { 
    product:{
        type:Sequelize.INTEGER,
        references:{
            model:Product,
            key: 'id'
        },
        onDelete:"CASCADE",
    },
    image: {
        type: Sequelize.STRING,
        allowNull:false,
    },
   
},{
    tableName: 'ProductImage'
})

ProductImage.sync({alter:true})



ProductImage.belongsTo(Product,{
    foreignKey:'product'
})

Product.hasMany(ProductImage, {
    foreignKey: 'product'

})




module.exports = ProductImage
