const Product = require('../../model/ProductModel')
const randomstring = require('randomstring')
const upload = require('../../middleware/multermiddleware')
const { status, get } = require('express/lib/response')
const Category = require('../../model/CategoryModel')
const Review = require('../../model/ReviewsModel')
const SubCategory = require('../../model/SubcategoryModel')
const User = require('../../model/UserModel')


const getPagingData = async (data, page, limit) => {
    const { count: totalItems, rows: product } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return await { totalItems, product, totalPages, currentPage };
};


const getPagination = async (page, size) => {
    const limit = size ? +size : 8;
    const offset = page ? page * limit : 0;
    return await { limit, offset };
};

exports.getCategory = async (req, res) => {

    try {
        const category = await Category.findAndCountAll().then(async category => {
            res.status(200).send(category)
        })
    }
    catch (err) {
        res.status(500).send(err)
    }
}


exports.getAllSubCategoryByCategory = async (req, res) => {
        const categoryid = req.params.uid
        try {
            const catid = await Category.findOne({ where: { uid: categoryid } })
            await SubCategory.findAndCountAll({ where: { categoryId: catid.id }, include: "Category" }).then(subcategory => {
                res.status(200).send(subcategory)
            })
        }
        catch (err) {
            res.status(500).send(err)
        }
    }

exports.getAllSubCategory = async (req, res) => {
    try {
        const category = await SubCategory.findAndCountAll().then(async category => {
            res.status(200).send(category)
        })

    } catch (err) {
        res.status(500).send(err)

    }
}