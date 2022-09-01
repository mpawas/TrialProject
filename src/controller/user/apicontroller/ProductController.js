const Product = require('../../model/ProductModel')
const slugify = require('slugify')
const upload = require('../../middleware/multermiddleware')
const Category = require('../../model/CategoryModel')
const Review = require('../../model/ReviewsModel')
const SubCategory = require('../../model/SubcategoryModel')
const User = require('../../model/UserModel')
const Op = require('sequelize').Op;
const ProductImage = require('../../model/ProductImage')
const Randomstrings = require('randomstring')
const { addImage } = require('../../../Utility/fileHandler')



const getPagingData = async (data, page, limit) => {
    const { count: totalItems, rows: product } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, product, totalPages, currentPage };
};
const getPagination = async (page, size) => {
    const limit = size ? +size : 8;
    var offset;
    if (!page || page<=1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit
    }

    return await { limit, offset };
};

exports.getProductsByAdmin = async (req, res) => {
    const { page, size, catid, subcatid } = req.query;

    const { limit, offset } = await getPagination(page, size);
    try {
        if (subcatid) {
            const category = await Category.findOne({ where: { uid: catid } })
            const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
            const product = await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id, subcategory: subcategory.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                const data = await getPagingData(product, page, limit);
                console.log("akncskcdn");
                res.status(200).send(data)
            })
        } else if (catid) {
            const category = await Category.findOne({ where: { uid: catid } })
            const product = await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" }, category: category.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                const data = await getPagingData(product, page, limit);
                res.status(200).send(data)
            })
        }
        else {
            const product = await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                const data = await getPagingData(product, page, limit);
                res.status(200).send(product.rows)
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }
}


exports.getProductsByUsers = async (req, res) => {
    const { page, size, catid, subcatid } = req.query;

    const { limit, offset } = await getPagination(page, size);
    console.log(limit, offset);
    try {
        if (subcatid) {
            const category = await Category.findOne({ where: { uid: catid } })
            const subcategory = await SubCategory.findOne({ where: { uid: subcatid } })
            const product = await Product.findAndCountAll({ where: { file: null, category: category.id, subcategory: subcategory.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                const data = await getPagingData(product, page, limit);
                res.status(200).send(data)
            })
        } else if (catid) {
            console.log(catid);
            const category = await Category.findOne({ where: { uid: catid } })
            await Product.findAndCountAll({ where: { file: null, category: category.id }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
                const data = await getPagingData(product, page, limit);
                console.log(data);
                res.status(200).send(data)
            })
        } else {
            const product = await Product.findAndCountAll({ where: { file: null }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] },).then(async product => {
                const data = await getPagingData(product, page, limit);
                res.status(200).send(data)
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }
}




exports.addProduct = async (req, res) => {
    try {
        const body = req.body;
        const name = await slugify(body.name)
        const image = await addImage(body.image)
        await Product.build({
            name: body.name,
            user: body.user,
            uid: name + body.category + body.subcategory + body.user + Randomstrings.generate(5),
            author: body.author,
            category: body.category,
            subcategory: body.subcategory,
            price: body.price,
            description: body.description,
            discout: body.discount,
            discount_percent: body.discount_percent,
            publication: body.publication,
            exchange: body.exchange
        }).save().then(async (product) => {
            await ProductImage.build({ product: product.id, image: image }).save().then((a) => {
                res.status(200).send("Your product has been sucessfully added" + a.image)
            })
        })
    } catch (err) {
        res.status(500).send(`Something went wrong.${err}`)
    }
}







exports.getSingleProduct = async (req, res) => {
    const slug = req.params.slug;
    const { page, size, sort } = req.query;
    const { limit, offset } = await getPagination(page, size, sort);
    try {
        await Product.findOne({ where: { uid: slug }, include: [{ model: Category, attributes: ["name", "uid"] }, {model:User,}, { model: SubCategory, attributes: ["name", "uid"] }, { model: Review, include: { model: User, attributes: ["username"] } }, { model: ProductImage }] }).then(async (product) => {
            product.update({ view: product.view + 1 })
            if (product.file === null) {
                await Product.findAndCountAll({ where: { file: null, category: product.category }, limit: limit,offset:offset, include: [{ model: ProductImage }, { model: Category }, { model: SubCategory }] }).then(async (similiar) => {
                    const data = await getPagingData(similiar, page, limit);
                    res.status(200).send({
                        product: product,
                        similiarproduct: data
                    })
                })
            }
            else {
                await Product.findAndCountAll({ where: { category: product.category, file: { [Op.ne]: "file" } }, limit: limit, offset: offset , include: [{ model: ProductImage }, ]}).then(async (similiarproduct) => {
                    const data = await getPagingData(similiarproduct, page, limit);
                    res.status(200).send({
                        product: product,
                        similiarproduct: data
                    })

                })
            }
        })
    } catch (error) {
        res.status(404).send(error)
    }
}




exports.updateSingleProduct = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;

    try {
        await Category.findOne({ where: { uid: slug } }).then((result) => {
            try {
                result.update({
                    author: body.author,
                    category: body.category,
                    subcategory: body.subcategory,
                    price: body.price,
                    discout: body.discount,
                    discount_percent: body.discount_percent,
                    publication: body.publication,
                    exchange: body.exchange
                }).then((a) =>
                    res.status(200).send(`Product ${a.name} had been updated`)
                )
            } catch (err) {
                res.status(500).send({ message: "Something went wrong." })
            }
        })
    } catch (error) {
        res.status(404).send({ message: "Product is not found." })
    }

}


exports.deleteProduct = async (req, res) => {
    const slug = req.params.slug;
    await Product.findOne({ where: { uid: slug } }).then((result) => {
        try {
            result.destroy().then((a) =>
                res.status(200).send(`${a.name} has been deleted.`)
            )
        } catch (err) {
            res.status(500).send(`something went wrong ${err}`)
        }
    })
}


exports.deleteProductImage = async (req, res) => {
    const slug = req.params.slug;
    try {
        await ProductImage.findByPk(id).then((data) => {
            data.destroy().then(() => res.status(200).send(`Image has been deleted.`))
        })
    } catch (err) {
        res.status(500).send(`something went wrong ${err}`)

    }
}





exports.getProductByUser = async (req, res) => {
    const user = req.params.user
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    try {
        const userID = await User.findOne({ where: { username: user } })
        await Product.findAndCountAll({ where: { user: userID.id }, include: [{ model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }, { model: ProductImage }] }).then(async (data) => {
            const product = await getPagingData(data, page, limit);
            res.status(200).send(product)
        })
    } catch (error) {
        res.status(500).send(error)
    }
}
