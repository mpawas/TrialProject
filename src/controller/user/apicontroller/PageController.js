const ContactUS = require( "../../model/ContactUSmodel")


exports.getDashboard = async (req, res) => {
    try {
        
    } catch (e) {

    }
}


exports.contactus = async (req, res) => {
    const body = req.body
    try {
        await ContactUS.build({
            email:body.email,
            phone:body.phone,
            name:body.name,
            subject:body.subject,
            message:body.message,
        }).save().then(data=>{
            res.status(200).send("Ok!")
        })
    } catch (e) {
        res.status(400).send(e)

    }
}

