const express = require('express')
const routes = express.Router()
const usercontroller = require('../../controller/user/apicontroller/UserAuthController')
const passwordcontroller  = require('../../controller/user/apicontroller/PasswordController')
const productcontroller = require('../../controller/user/apicontroller/ProductController')
const productfiltercontroller = require('../../controller/user/apicontroller/ProductFilterController')
const subscriptioncontroller = require('../../controller/admin/apicontroller/SubscriptionController')
const pageController = require('../../controller/user/apicontroller/PageController')
const middleware = require('../../controller/middleware/AuthValidator')
const ReviewController = require('../../controller/user/apicontroller/ReviewController')
const { getCategory, getAllSubCategory,getAllSubCategoryByCategory } = require('../../controller/user/apicontroller/CategoryController')
const Passportmiddleware = require('../../controller/middleware/Passportmiddleware')


module.exports = ()=>{
    // routes.post('/home')
    routes.post("/register", middleware.RegisterValidators, usercontroller.register),

    routes.get("/refreshuser",  usercontroller.refreshToken),
    routes.post("/login", usercontroller.login),
    routes.post("/contact-us", pageController.contactus),
    routes.get("/verify/:email/:verification_key", usercontroller.verify),
    routes.get("/new-link/:email", usercontroller.new_link),

    routes.post("/forget-password",middleware.UserValidator, passwordcontroller.forget_pwd),
    routes.post("/reset-password/:email", passwordcontroller.reset_pwd),
    routes.post("/new-password/:email", passwordcontroller.new_pwd)

    routes.get("/categories", getCategory),
    routes.get("/category/:uid/subcategorylist", getAllSubCategoryByCategory), //?size=2&page=0&sort=ASC
     //?size=2&page=0&sort=ASC

     
    routes.get("/products/admin", productcontroller.getProductsByAdmin), //?size=2&page=0&sort=ASC

    routes.post("/addproduct", productcontroller.addProduct),
    routes.get('/products/:user', productcontroller.getProductByUser)
    routes.get("/product/:slug", productcontroller.getSingleProduct),
    routes.put("/product/:slug", productcontroller.updateSingleProduct),
    routes.delete("/product/:slug", productcontroller.deleteProduct),
    routes.get("/products/admin/sort", productfiltercontroller.getAdminProductbySorting),
    routes.get("/products/user/sort", productfiltercontroller.getUserProductbySorting),

    // routes.get("/product/:subCategory", productfiltercontroller.getProductbysubCatergory),
    // routes.get("/product/:slug", productfiltercontroller.getProductbyPrice)
    routes.get('/product/:slug/reviews', ReviewController.allReviews)
    routes.post('/product/:slug/add-review', ReviewController.addReview)
    routes.get('/search', productfiltercontroller.search)


    // routes.get("/subscription", subscriptioncontroller),
    // routes.put("/editsubscription/:slug", subscriptioncontroller)






    


    return routes
}