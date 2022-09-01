const Product = require("../../model/ProductModel");
const Op = require('sequelize').Op;

const ProductImage = require('../../model/ProductImage')
const Category = require('../../model/CategoryModel')
const SubCategory = require('../../model/SubcategoryModel');
const db = require("../../database/db");



const getPagingData = async (data, page, limit) => {
    const { count: totalItems, rows: product } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return await { totalItems, product, totalPages, currentPage };
};


const getPagination = async (page, size) => {
    const limit = size ? +size : 8;
    var offset;
    if (page <= 1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit
    }

    return await { limit, offset };
};


exports.getAdminProductbySorting = async (req, res) => {
    const { page, size, sorting, subcatid, catid } = req.query;
    const { limit, offset } = await getPagination(page, size);
    try {
        if (subcatid) {
            const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
            if (catid) {
                const category = await Category.findOne({ where: { uid: catid } })
                if (sorting == 'A-Z') {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "Z-A") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "popularity") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "hightolow") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "lowtohigh") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
            }
            else {
                if (sorting == 'A-Z') {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "Z-A") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "popularity") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "hightolow") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else if (sorting == "lowtohigh") {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
                else {
                    await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, subcategory: subcategory.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                        const data = await getPagingData(product, page, limit);
                        res.status(200).send(data)
                    })
                }
            }
        } else if (catid) {
            const category = await Category.findOne({ where: { uid: catid } })
            if (sorting == 'A-Z') {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "Z-A") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "popularity") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "hightolow") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "lowtohigh") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
        } else {
            if (sorting == 'A-Z') {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "Z-A") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "popularity") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "hightolow") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "lowtohigh") {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else {
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })

            }
        }
    }
    catch (err) {
        res.status(500).send(err)
    }
}




exports.getUserProductbySorting = async (req, res) => {
    const { page, size, sorting, catid, subcatid } = req.query;
    const { limit, offset } = await getPagination(page, size);
    try {
        if (subcatid) {
            const category = await Category.findOne({ where: { uid: catid } })
            const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
            if (sorting == 'A-Z') {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "Z-A") {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "popularity") {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "hightolow") {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "lowtohigh") {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else {
                await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
        } else if (catid) {
            const category = await Category.findOne({ where: { uid: catid } })
            if (sorting == 'A-Z') {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "Z-A") {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "popularity") {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "hightolow") {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "lowtohigh") {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else {
                await Product.findAndCountAll({ where: { file: null, category: category.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
        } else {
            if (sorting == 'A-Z') {
                await Product.findAndCountAll({ where: { file: null }, order: [["name", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "Z-A") {
                await Product.findAndCountAll({ where: { file: null }, order: [["name", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "popularity") {
                await Product.findAndCountAll({ where: { file: null }, order: [["views", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "hightolow") {
                await Product.findAndCountAll({ where: { file: null }, order: [["price", "DESC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else if (sorting == "lowtohigh") {
                await Product.findAndCountAll({ where: { file: null }, order: [["price", "ASC"]], limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })
            }
            else {
                await Product.findAndCountAll({ where: { file: null }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }]}).then(async (product) => {
                    const data = await getPagingData(product, page, limit);
                    res.status(200).send(data)
                })

            }
        }
    }
    catch (err) {
        res.status(500).send(err)
    }
}


exports.search = async (req, res) => {
    const { page, sorting, subcatid, catid, product } = req.query;
    try {
        if (catid) {
            const category = await Category.findOne({ where: { uid: catid } })
            if (subcatid) {
                const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id}, order: [["name", "ASC"]], include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    res.status(200).send(product.rows)
                })
            }
            else {
                const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
                await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, order: [["name", "ASC"]], include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                    res.status(200).send(product.rows)
                })
            }
        }
        else {
            res.status(500).send("errr")
        }
    }
    catch (err) {
        res.status(500).send(err)
    }
}