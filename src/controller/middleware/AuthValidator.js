const { body, check, validationResult } = require("express-validator")
const User = require("../model/UserModel")


exports.RegisterValidators = [
    check('email').isEmail().withMessage('Email is not valid.').bail()
    .isLength({ max: 250 }).withMessage('Email cannot be this long.').bail()
    .custom(async value =>{
        const one = await User.findOne({where:{email : value}})
        if(one != null){
            return Promise.reject()
        }
        else{
            return true
        }
    }).withMessage('Email is already in use.').bail(),
    check('phone').notEmpty().withMessage('Please enter your phone number').bail().isLength({max:10,min:10}).withMessage('Phone number should be of 10 digit').bail()
    .isNumeric().withMessage('Phone number should be in number').bail().custom(async value=>{
        const one = await User.findOne({ where: { phone: value } })
        if (one != null) {
            return Promise.reject()
        }
        else {
            return true
        }
    }).withMessage('Phone Number is already in use.').bail(),
    check('firstname').notEmpty().withMessage('Please enter your first name.').bail()
    .isLength({max: 50 }).withMessage('Firstname should not exceed 50 letters').bail(),
    check('lastname').notEmpty().withMessage('Please enter your lastname.').bail()
    .isLength({max: 50 }).withMessage('Lastname should not exceed 50 letters').bail(),
    check('address').isLength({max: 350}).withMessage('Address should not exceed 350 letters').bail()
    .notEmpty().withMessage('Please enter your billing address.'),
    check('password').notEmpty().withMessage('Please enter a valid password')
    .isLength({ min: 8, max: 50 }).withMessage('Your Password Strength Is Not Good Enough').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            res.send(err)
            return
        }
        next()
    }
]


exports.LoginValidators = [
    check('email').isEmail().withMessage('Email is not valid.').bail()
    .isLength({ max: 250 }).withMessage('Email cannot be this long.').bail()
    .custom(async value=>{
        const one = await User.findOne({where:{email: value}})
        if(one != null){
            return Promise.send(one)
        }
        else{
            return res.send(errors)
        }
    }),
    check('password').isLength({ min: 8, max: 50 }).withMessage('Your Password Strength Is Not Good Enough').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            res.send(err)
            return
        }
        next()
    }
]


exports.UserValidator = [
    check('email').isEmail().withMessage('Email is not valid.').bail()
    .isLength({ max: 250 }).withMessage('Email cannot be this long.').bail()
    .custom(async value=>{
        const one = await User.findOne({where:{email: value}})
        if(one != null){
            return true
        }
        else{
            return Promise.reject()
        }
    }),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            res.status(404).send("Email not Found")
            return
        }
        next()
    }
]