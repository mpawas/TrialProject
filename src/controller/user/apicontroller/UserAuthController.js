const User = require('../../model/UserModel')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const saltRounds = 10
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { addImage } = require('../../../Utility/fileHandler')
const ejs = require('ejs')
const randomstring = require('randomstring')
const db = require('../../database/db')
const {Sequelize} = require('sequelize')
const {sendEmail} = require('../../middleware/Mailer')

exports.register = async (req, res) => {
    const body = req.body;
    const token = randomstring.generate(16)
    const username = body.email.split('@')
    const image = await addImage(body.image)
    try {
        const user = await User.build({
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            username: username[0] + randomstring.generate(4),
            image: image,
            email_token: token,
            phone: body.phone,
            address: body.address
        }).save()
        const hash = await bcrypt.hash(body.password, saltRounds)
        await user.update({ password: hash })
        try {
            const data = await ejs.renderFile(__dirname + '/../../../../src/public/View/welcomeMail.ejs', { token: token, user: user, site: process.env.APP_URL })
            await sendEmail(user.email, 'Verify Your Email', data)
            res.status(200).send(`Your account has been created with email ${user.email} `)
        } catch (err) {
            res.status(400).send(err)
        }
    }
    catch (err) {
        res.status(400).send(`Something went wrong ${err}`)
    }

}

exports.verify = async (req, res) => {
    const email = req.params.email
    const verificationkey = req.params.verification_key;
    try {
        const user = await User.findOne({
            where: {
                email_token: verificationkey, email: email
            }
        })
        if (user.email_verified) {
            res.status(401).send({
                message: `Your email has been already verified. Mr./Mrs./Miss. ${user.firstname}`
            })
        }
        else if (!user.email_verified) {
            user.update({ email_verified: true }).then((a) => {
                res.status(200).send({ message: `Your Email has been verified. Mr./Mrs./Miss. ${a.firstname}` })
            })
        }
        else {
            res.status(404).send({
                message: 'Your email has not been verified with given link. Please request a new link.'
            })
        }
    }
    catch (err) {
        res.status(404).send({
            message: `The link is expired or wrong. Please check the right link or request new link.`
        })
    }
}

exports.new_link = async (req, res) => {
    const email = req.params.email
    const token = randomstring.generate(16)
    try {
        const user = await User.findOne({ where: { email: email } })
        if (user.email_verified) {
            return res.status(401).send({
                message: `Your account has already been verified. Mr./Mrs./Miss. ${user.firstname}`
            })
        }
        else {
            await user.update({ email_token: token }).then(async (user) => {
                const data = await ejs.renderFile(__dirname + '/../../../../src/public/View/welcomeMail.ejs', { token: token, user: user, site: process.env.APP_URL })
                await mail.sendEmail(user.email, 'Verify Your Email', data)
                res.status(200).send('Mail sent.')
            })

        }
    } catch (err) {
        res.status(404).send(err)
    }
}


const refreshTokens = []

const generateAcessToken = async (user) => {
    const jwtToken = await jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWTACESSSECRET,
        { expiresIn: "1250min" }
    );
    return jwtToken
}

const generateRefreshToken = async (user) => {
    const jwtToken = await jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWTREFRESHSECRET,
        { expiresIn: "1250min" }
    );
    return jwtToken
}



exports.login = async (req, res) => {
    const { email, password } = req.body
    let user
    try {
        user = await User.findOne({ where: { email: email } }) || await User.findOne({ where: { username: email } })
        await bcrypt.compare(password, user.password, async function (err, result) {
            // result == true
            if (result == true) {
                const acessToken = await generateAcessToken(user)
                const refreshToken = await generateRefreshToken(user)
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: user, accessToken: acessToken, refreshToken: refreshToken });

            } else {
                res.status(200).json({ 'error': `Username or Password does not match.` })
            }
        })
    } catch (error) {
        res.status(200).send({ 'error': `Username or Password does not match.` })
    }

}

exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    if (refreshToken = refreshTokens) {
        jwt.verify(
            refreshToken,
            process.env.JWTREFRESHSECRET,
            (err, decoded) => {
                const accessToken = jwt.sign(
                    { "username": decoded.username },
                    process.env.JWTACCESSSECRET,
                    { expiresIn: '1250min' }
                );
                res.status(200).send({ accessToken: accessToken })
            }
        );
    }
}




exports.emailVerify = async (user, token) => {
    try {

        const transporter = await nodemailer.createTransport({
            service: process.env.SERVICES,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Account Verification Link',
            text: 'Hello ' + user.username + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/confirmation\/' + token + '\n\nThank You!\n'
        };
        await transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });
            }
            return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
        });
    } catch (err) {
        return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });

    }
}







