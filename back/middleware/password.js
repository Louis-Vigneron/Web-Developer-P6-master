var passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema
    .is().min(8)
    .is().max(64)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

module.exports = (req, res, next) => {
    if (schema.validate(req.body.password)) {
        next();
    }
    else {
        return res.status(400).json({ error: schema.validate('joke', { list: true }) })
    }
}