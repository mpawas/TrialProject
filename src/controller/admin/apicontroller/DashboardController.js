const Product = require("../../model/ProductModel")

exports.mostViewed = async(req,res)=>{
    Product.findAndCountAll()
}



exports.latestAdded = async(req,res)=>{
}



exports.mostViewed = async(req,res)=>{
}