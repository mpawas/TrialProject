const express = require('express')
const routes = express.Router()
const upload = require('../../controller/middleware/multermiddleware')


const dashboardcontroller = require('../../controller/admin/apicontroller/DashboardController')
const usercontroller = require('../../controller/admin/apicontroller/UserController')
const productcontroller = require('../../controller/admin/apicontroller/ProductController')
const categorycontroller = require('../../controller/admin/apicontroller/CategoryController')
const subcategorycontroller = require('../../controller/admin/apicontroller/SubcategoryController')
const subscriptioncontroller = require('../../controller/admin/apicontroller/SubscriptionController')
const { ProductValidator } = require('../../controller/middleware/ProductValidator')
const extraController = require('../../controller/admin/apicontroller/ExtrasController')



module.exports = ()=>{
    routes.get("/dashboard", dashboardcontroller.mostViewed),
    routes.get("/users", usercontroller.get),
    // routes.put("/user/:slug", usercontroller),
    // routes.get("/edituser/:slug", usercontroller),
    routes.get("/category", categorycontroller.get),
    routes.post("/addcategory", categorycontroller.post),
    routes.get("/editcategory/:slug", categorycontroller.update)
    routes.post("/editcategory/:slug", categorycontroller.put),
    routes.delete("/deletecategory/:slug", categorycontroller.delete),
    routes.get("/subcategory", subcategorycontroller.get),
    routes.post("/addsubcategory", subcategorycontroller.post),
    routes.get("/editsubcategory/:slug", subcategorycontroller.update),
    routes.post("/editsubcategory/:slug", subcategorycontroller.put),
    routes.delete("/deletesubcategory/:slug", subcategorycontroller.delete),
    routes.post("/addbanner", extraController.addBanner),
    routes.get('/banners', extraController.getBanners)

    routes.get("/product-list/admin", productcontroller.getProductsByAdmin), //?size=2&page=0&sort=ASC
    routes.get("/product-list/user", productcontroller.getProductsByUsers), //?size=2&page=0&sort=ASC

    routes.post("/add-product",ProductValidator, productcontroller.addProduct),
    routes.get("/product/:slug", productcontroller.getSingleProduct),
    routes.post("/product/:slug", productcontroller.updateSingleProduct),
    routes.delete("/product/:slug", productcontroller.deleteProduct)

    // routes.get("/subscription", subscriptioncontroller),
    // routes.put("/editsubscription/:slug", subscriptioncontroller)


    return routes
}