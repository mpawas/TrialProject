const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../model/UserModel')
const secret_key = process.env.SECRETKEY
const jwt = require('jsonwebtoken')


exports.verifyJWT = async(req, res, next) => {
  var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  if (token) {
      await jwt.verify(token, process.env.APP_SECRET, async (err, decode) => {
          if (err) res.status(403).send('User Is Not Authenticated')
          else {
              await User.findOne({ where: { user_name: decode.user, role: decode.role, token: token } }).then((u) => {
                  if (!u) res.status(403).send('User Is Not Authenticated')
                  else {
                      req.user = u
                      next()
                  }

              }).catch((err) => res.status(500).send('User Is Not Authenticated'))
          }
      })
  }
  else res.status(403).send('User Is Not Authenticated')
}


