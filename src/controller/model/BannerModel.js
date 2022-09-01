const Sequelize = require('sequelize')
const db = require('../database/db')

const Product = require('./ProductModel')

const Banner = db.define('Banner', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
}, {
    tableName: 'Banner'
})

Banner.sync({ alter: true })


const BannerProducts = db.define('BannerProducts', {
    bannerid: {
        type: Sequelize.INTEGER,
        references:{
            model: Banner,
            key:"id"
        }
    },
    product: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: "id"
        }
    },
}, {
    tableName: 'BannerProducts'
})

BannerProducts.sync({ alter: true })


Banner.hasMany(BannerProducts, {
    foreignKey: "bannerid"
})


BannerProducts.belongsTo(Banner, {
    foreignKey: "bannerid"
})


BannerProducts.belongsTo(Product, {
    foreignKey: "product"
})

Product.hasOne(BannerProducts, {
    foreignKey: "product"
})


module.exports = { BannerProducts, Banner }


