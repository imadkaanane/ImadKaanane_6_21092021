const passwordSchema = require('../models/password')

module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        return res.status(400).json({error: 'mot de passe trop faible !' + passwordSchema.validate(req.body.password, {list: true}) })
    } else {
        next()
    }
}