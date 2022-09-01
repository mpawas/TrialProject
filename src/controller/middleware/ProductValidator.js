const Product = require("../model/ProductModel");
const { body, check, validationResult } = require("express-validator")


exports.ProductValidator = [
    check('name').notEmpty().withMessage('Please enter the Name.').bail(),
    check('category').notEmpty().withMessage('Please Select the category.').bail(),
    check('subcategory').notEmpty().withMessage('Please select the subcategory.').bail(),
    check('author').notEmpty().withMessage('Please enter the author.').bail(),
    check('description').notEmpty().withMessage('Please enter the description.').bail().isLength({ min:50, max: 2500 }).withMessage("Description should be between 50 to 2000.").bail(),
    check('file').notEmpty().withMessage('Please upload the file.').bail(),
    check('images').notEmpty().withMessage('Please upload the image.').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            res.send(err)
            return
        }
        next()
    }

]




