const { body,param, validationResult } = require('express-validator')
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
            case "walletOne":
                return [
                    param('id_wallet','field id wallet anda masih kosong').notEmpty().isMongoId()
                ];
            case "voucherValid":
                return [
                    body('code_voucher_idx','code voucher indodax anda masih kosong').notEmpty(),
                ];
            case "createVoucher":
                return [
                    body('code_voucher_idx','code voucher indodax anda masih kosong').notEmpty(),
                    body('code_voucher_idx','code voucher indodax tidak dikenal').contains("BTC-IDR")
                ];
            case "cairkanVoucher":
                return [
                    body('code_voucher_idx','code voucher indodax anda masih kosong').notEmpty(),
                    body('email','email pengirim anda masih kosong').notEmpty().isEmail(),
                    body('saldo','saldo voucher masih kosong').notEmpty().isNumeric(),
                ];
            case "withdrawVoucher":
                return [
                    body('saldo','saldo withdraw anda masih kosong').notEmpty().isNumeric(),
                ];
            case "voucherIdParams":
                return [
                    param('id_voucher','id voucher anda masih kosong').notEmpty(),
                    param('id_voucher','id voucher anda tidak valid').isMongoId()
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