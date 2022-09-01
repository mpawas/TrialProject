const User = require("../../model/UserModel")


exports.get = async (req, res) => {
    try {
        await User.findAndCountAll({}).then((data) => {
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(500).send("err")
    }
}
