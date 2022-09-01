const randomstring = require('randomstring')
const fs = require('fs')
const res = require('express/lib/response')



exports.addImage = async (image) => {
    const location = 'src/public/Storage/Uploads'
    const filename = Date.now() + randomstring.generate('8')
    var data = image.replace(/^data:image\/\w+;base64,/, "")

    

    var fName = `${location}/${filename}.png`
    var dbLocation = `Uploads/${filename}.png`

    fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
        responses.serverError(res, err)
    })

    return dbLocation
}

exports.removeImage = async (url) => {
    var url = `${__dirname}/../public/Storage/${url}`
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    })
}


exports.addFile = async (file) => {
    const location = 'src/public/Storage/File'
    const filename = Date.now() + randomstring.generate('8')
    var data = file.replace(/^data:image\/(png|gif|jpeg|jpg|pdf);base64,/, "")  
    var fName = `${location}/${filename}.pdf`
    var dbLocation = `File/${filename}.pdf`
    fs.writeFileSync(fName, data, { encoding: "base64" }, function (err) {
        res.status(500).send("error while file handling")
    })

    return dbLocation
}

exports.removeFile = async(file) =>{
    var url = `${__dirname}/../public/Storage/${url}`
    await fs.unlink(url, (err) => {
        if (err) {
            console.log(err)
        }
    }) 
}