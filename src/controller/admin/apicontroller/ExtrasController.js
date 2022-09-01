const Product = require('../../model/ProductModel')
const Review = require('../../model/ReviewsModel')
const upload = require('../../middleware/multermiddleware')
const Category = require('../../model/CategoryModel')
const slugify = require('slugify')
const SubCategory = require('../../model/SubcategoryModel')
const ProductImage = require('../../model/ProductImage')
const Op = require('sequelize').Op;
const Randomstring = require('randomstring')
const { addFile, addImage } = require('../../../Utility/fileHandler')
const {Banner, BannerProducts} = require('../../model/BannerModel')


const getPagingData = async (data, page, limit) => {
    const { count: totalItems, rows: product } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, product, totalPages, currentPage };
};
const getPagination = async (page, size) => {
    const limit = size ? +size : 25;
    let offset;
    if (!page || page <= 1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit
    }
    return await { limit, offset };
};


exports.getProductsByAdmin = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = await getPagination(page, size);
    try {
        const product = await Product.findAndCountAll({ where: { file: { [Op.ne]: "file" } }, limit: limit, offset: offset, include: [{ model: ProductImage }, { model: Category, attributes: ["name", "uid"] }, { model: SubCategory, attributes: ["name", "uid"] }] }).then(async product => {
            const data = await getPagingData(product, page, limit);
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(500).send(error)
    }

}


exports.getBanners = async (req, res) => {
    try {
        await Banner.findAndCountAll({}).then(async (banner) => {
            res.status(200).send(banner.rows)
        })
    } catch (error) {
        res.status(500).send(error)
    }
}




exports.addBanner = async (req, res) => {
    // try {
        const rndmstrng = Randomstring.generate({ length: 3, charset: 'alphabetic', capitalization: 'lowercase' })
        const body = req.body;
        console.log(body.products);
        // const dbLocation = await addImage(body.image)
        await Banner.build({
            name: body.name,
            // image: dbLocation,
            active: body.acive,
            uid: rndmstrng
        }).save().then((banner)=>{
            body.products.forEach(async(e) => {
                console.log(e);
                await BannerProducts.build({
                    bannerid:banner.id,
                    product:e
                }).save()         
            });
        })
        
        // return console.log(banner);

    // }
    // catch (err) {
    //     res.status(500).send(`Something went wrong.${err}`)
    // }
}



exports.getSingleProduct = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;
    try {
        await Product.findOne({ where: { uid: slug } }).then((data) => {
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(404).send({
            message: 'Product not found'
        })
    }

}

exports.updateSingleProduct = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;
    var productFile = await file(req, res)
    await Category.findOne({ where: { uid: slug } }).then((result) => {
        try {
            if (!productImage) {
                productImage = result.image
            }
            if (!productFile) {
                productFile = result.file
            }
            result.update({
                image: productImage,
                file: productFile,
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
            res.json({ status: 500, message: `something went wrong. ${err}` })
        }
    })

}




exports.deleteProduct = async (req, res) => {
    const slug = req.params.slug;    
    await Product.findOne({ where: { uid: slug } }).then((result) => {
        result.destroy()
        res.status(200).send('Product has been removed.')
    }).catch((err) => {
        res.status(500).send("something wend wrong")
    })
}