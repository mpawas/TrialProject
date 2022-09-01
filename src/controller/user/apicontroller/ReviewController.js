const { body, param } = require('express-validator');
const Product = require('../../model/ProductModel');
const Review = require('../../model/ReviewsModel')



const getPagingData = async (data, page, limit) => {
    const { count: totalItems, rows: reviews } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return await { totalItems, reviews, totalPages, currentPage };
};


const getPagination = async (page, size) => {
    const limit = size ? +size : 8;
    const offset = page ? page * limit : 0;
    return await { limit, offset };
};



exports.addReview = async (req, res) => {
    const slug = req.params.slug
    const body = req.body
    try{
        const product = await Product.findOne({where:{uid:slug}})
        const review = await Review.build({
            user: body.user,
            review: body.review,
            product: product.id,
            rating: body.rating
        }).save().then((review)=>{
            res.status(200).send({
                message:`Your review has been added.`
            })
        })
    }
    catch(err){
        res.status(500).send(`Something went wrong ${err}`)
    }
    
}

exports.allReviews = async(req, res) =>{
    const slug = req.params.slug
    const { page, size, sort } = req.query;
    const { limit, offset } = await getPagination(page, size);
    try{
        const product = await Product.findOne({where:{uid:slug}})
        await Review.findAndCountAll({where:{product:product.id}, limit: limit, offset: offset },).then(async review => {
            const data = await getPagingData(review, page, limit);
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send(`something went wrong ${err}`)
    }
}

