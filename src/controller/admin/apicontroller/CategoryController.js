const Category = require('../../model/CategoryModel')
const randomstring = require('randomstring')
const slugify = require('slugify')
const upload = require('../../middleware/multermiddleware')
const { removeImage, addImage } = require('../../../Utility/fileHandler')



exports.get = async (req, res) => {
    try {
        await Category.findAndCountAll({}).then((data) => {
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(500).send("err")
    }
}






exports.post = async (req, res, next) => {
    const body = req.body;
    try {
        const slug = await slugify(body.name, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true
        })
        const one = await Category.findOne({ where: { uid: slug } })
        if (one != null) {
            const dbLocation = await addImage(body.image)
            const category = await Category.build({
                name: body.name,
                uid: slug,
                image: dbLocation
            }).save().then((cat) =>
                res.status(200).send(`${cat.name} has been created.`))
        }
        else {
            return res.status(409).send("Already exist")
        }
    }
    catch (err) {
        res.status(500).send(`Something went wrong. ${err}`);
    }
}



exports.update = async (req, res) => {
    const slug = req.params.slug;
    await Category.findOne({ where: { uid: slug } }).then((result) =>
        res.status(200).send(result)
    ).catch((err) => {
        res.status(500).send('error')
    })
}


exports.put = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;
    try {
        await Category.findOne({ where: { uid: slug } }).then(async(result) => {
            try {
                const a = await removeImage(result.image)
                const image = await addImage(body.image)
                await result.update({ name: body.name, image: image }).then((a) =>
                    res.status(200).send(`${a.name} has been update.`))
            } catch (err) {
                res.status(500).send("Something went wrong.")
            }
        })
    } catch (error) {

    }

}




exports.delete = async (req, res) => {
    const slug = req.params.slug;
    await Category.findOne({ where: { uid: slug } }).then((result) => {
        try {
            result.destroy().then((a) =>
                res.json({ status: 201, message: "Category has been deleted." })
            )
        } catch (err) {
            res.json({ status: 500, message: `something went wrong.${err}` })
        }
    })
}
