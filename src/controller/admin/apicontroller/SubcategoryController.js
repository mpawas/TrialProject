const SubCategory = require('../../model/SubcategoryModel')
const randomstring = require('randomstring')
const slugify = require('slugify')
const upload = require('../../middleware/multermiddleware')
const { status } = require('express/lib/response')
const FileAppender = require('multer/lib/file-appender')
const Category = require('../../model/CategoryModel')
const res = require('express/lib/response')
const { addImage, removeImage, addFile } = require('../../../Utility/fileHandler')



exports.get = async (req, res) => {
    await SubCategory.findAndCountAll({ include: { model: Category } }).then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(500).send('err')
    })

}




exports.post = async (req, res) => {
    try {
        const body = req.body;
        const slug = await slugify(body.name, {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            locale: 'vi',       // language code of the locale to use
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
        })
        const rndmstrng = randomstring.generate({ length: 3, charset: 'alphabetic', capitalization: 'lowercase' })
        const img = await addImage(body.image)
        const subcategory = await SubCategory.build({
            name: body.name,
            uid: slug + rndmstrng,
            categoryId: body.category,
            image: img,
        }).save().then(() =>
            res.status(200).send("Ok!")
        )

    }
    catch (err) {
        res.status(500).send({
            message: `Something went wrong. ${err}`,
        });
    }
}



exports.update = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;
    await SubCategory.findOne({ where: { uid: slug } }).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(500).send('Error')
    })
}
exports.put = async (req, res) => {
    const body = req.body;
    const slug = req.params.slug;
    await SubCategory.findOne({ where: { uid: slug } }).then(async (result) => {
        try {
            const a = await removeImage(result.image)
            const img = await addImage(body.image)
            result.update({ name: body.name, image: img }).then((a) =>
                res.status(200).send('Ok')
            )
        } catch (err) {
            res.status(500).send('Ok')
        }
    }).catch((err)=>{
        res.status(500).send('Ok')
    })

}




exports.delete = async (req, res) => {
    const slug = req.params.slug;
    console.log(slug);
    await SubCategory.findOne({ where: { uid: slug } }).then((result) => {
        try {
            result.destroy().then((a) =>
                res.status(200).send("Sub-Category has been deleted.")
            )
        } catch (err) {
            res.status(500).send(`Something went wrong.${err}`)
        }
    })
}
