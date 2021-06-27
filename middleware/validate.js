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
            case "ValidateProjectAdd":
                return [
                    body('project_name','Project name tidak boleh kosong').notEmpty(),
                    body('category','category name tidak boleh kosong').notEmpty(),
                    body('profit_interest','Profit interest tidak boleh kosong').notEmpty(),
                    body('profit_interest','Profit interest harus numeric').isNumeric(),
                    body('profit_interest_week','profit interset week tidak boleh kosong').optional(),
                    body('min_balance','Minimal balance tidak boleh kosong').notEmpty(),
                    body('min_balance','Minimal balance harus numeric').isNumeric(),
                    body('max_balance','Maksimal balance tidak boleh kosong').notEmpty(),
                    body('max_balance','Maksimal balance harus numeric').isNumeric(),
                    body('session_time','Sesi Waktu tidak boleh kosong').notEmpty(),
                    body('session_time','Sesi Waktu harus numeric').isNumeric(),
                ];
            case "ValidateProjectParamsID":
                return [
                    param('id_project','id project tidak boleh kosong').notEmpty(),
                ];
            case "ValidateLepCreate":
                return [
                    body('frozen_balance','frozen balance tidak boleh kosong').notEmpty(),
                    body('frozen_balance','frozen balance harus numeric').isNumeric(),
                    body('category_project','category name tidak boleh kosong').notEmpty(),
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