const User = require('../../model/UserModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const mail = require('../../middleware/Mailer')
const ForgetPwd = require('../../model/ForgetPwd')
const ejs = require('ejs')



exports.forget_pwd = async (req, res) => {
    const body = req.body
    const tokens = await Math.random().toString().substring(2, 8)
    try {
        const user_ = await ForgetPwd.findOne({ where: { user: body.email } })
        if (!user_) {
            const token = ForgetPwd.build({
                user: body.email,
                token: tokens
            })
            const data = ejs.renderFile(__dirname +'/../../../../src/public/View/PasswordResetMail.ejs', { token: tokens })
            await await mail.sendEmail(body.email, "Reset Your Password", data)
            await token.save().then((res) => res.status(200).send('ok')).catch((err) => res.status(500).send('Failed!'))

        }
        else {
            await user_.update({ token: tokens }).then(async (user) => {
                const data = await ejs.renderFile(__dirname + '/../../../../src/public/View/PasswordResetMail.ejs', { token: tokens })
                await mail.sendEmail(body.email, "Reset Your Password", data)
                res.status(200).send('ok')
            }).catch((err)=> res.status(500).send(err))
        }
    }
    catch (err) {
        return res.status(500).send('Something went wrong!')
    }
}

exports.reset_pwd = async (req, res) => {
    const email = req.params.email
    const token = req.body.token
    console.log(token);
    try {
        const user_ = await ForgetPwd.findOne({ where: { token: token, user: email } })
        if (user_) {
            return res.status(200).send({
                user: user_.user
            });
        }
        else {
            return res.status(404).send({
                message: "The token you have entered is expired or your email is wrong. Please check once."
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: err
        })
    }
}

exports.new_pwd = async (req, res) => {
    const body = req.body
    const email = req.params.email
    try {
        const user = await User.findOne({ where: { email: email } }).then(async (user) => {
            await bcrypt.hash(body.password, saltRounds).then(async (hash) => {
                user.update({ password: hash })
            })
            res.status(200).send('ok')
        })
    }
    catch (err) {
        res.send(500).send(err)
    }

}
