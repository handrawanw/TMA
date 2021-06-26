const { body, validationResult } = require('express-validator')
class TradeValidation {

    static validate(method) {
        switch (method) {
            case "login":
                return [
                    body('email', 'Email anda tidak boleh kosong').notEmpty().isString(),
                    body('password', 'Password anda tidak boleh kosong').notEmpty().isString(),
                ];
            case "daftar":
                return [
                    body('email', 'Email anda masih kosong kosong').notEmpty().isString(),
                    body('password', 'Password anda masih kosong kosong').notEmpty().isString(),
                    body('full_name', 'Nama lengkap anda masih kosong kosong').notEmpty().isString(),
                ];

            default:
                return [];
        };
    }

    static viewValidateError(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.array(),
                validate: 'error'
            });
        } else {
            next();
        }
    }

}

module.exports = TradeValidation;