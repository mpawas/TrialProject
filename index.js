const express = require('express')
const app = express()
require('dotenv').config({ encoding: 'latin1' })
const db = require('./src/controller/database/db')
const path = require('path')
const methodOverride = require('method-override') 
const bodyParser = require('body-parser')
const passport = require('passport')
const cookie = require('cookie-parser')
const nodemailer = require("nodemailer")
const cors  = require('cors')
app.use(cors())

app.use(passport.initialize())

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookie())

const port = process.env.APP_PORT
const adminApiRoutes = require('./src/routes/admin/api')
const userApiRoutes = require('./src/routes/user/api')


app.use(methodOverride('_method'))
app.use(express.urlencoded({limit: "25mb", extended: true }))
app.use(express.static(path.join(__dirname, './src/public/Storage/')))
app.use(express.json())


app.use('/api/v1/admin/', adminApiRoutes())
// app.use('/admin/', adminWebRoutes())
app.use('/api/v1/user/', userApiRoutes())
// app.use('/user/', userWebRoutes())



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/public/View/'))


app.listen(port, (error) => {
  console.log(`Example app listening on port ${port}`)
})