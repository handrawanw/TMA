const {
    Wallet,
    Voucher
} = require("../models");

class VoucherPengguna {

    static requestVoucher(req, res, next) {
        const { code_voucher_idx, description } = req.body;
        Voucher.create({
            code_voucher_idx, description
        }).then((Voucher) => {
            if (Voucher) {
                res.status(200).json({
                    message: "Permintaan Topup Voucher sudah terbuat, silakan tunggu persetujuan admin",
                    Voucher
                });
            } else {
                throw new Error("Topup voucher gagal terbuat, silakan coba lagi !");
            }
        }).catch(next);
    }

    static konfirmasiVoucher(req, res, next) {
        const { code_voucher_idx } = req.body;
        Voucher.findOne({ code_voucher_idx }).then((Voucher) => {
            if (Voucher) {
                res.status(200).json({
                    message: "Voucher ditemukan",
                    Voucher
                });
            } else {
                throw new Error("Voucher tidak ditemukan");
            }
        }).catch(next);
    }

    static topUpBalance(req, res, next) {
        const {id}=req.decoded;
        const { code_voucher_idx, email, saldo } = req.body;
        Voucher.findOne({ code_voucher_idx }).populate("sender").then((VoucherAccount) => {
            if (VoucherAccount) {
                if (VoucherAccount.sender.email === email) {
                    VoucherAccount.saldo = saldo;
                    VoucherAccount.validate();
                    VoucherAccount.save();
                    return VoucherAccount;
                } else {
                    throw new Error("Email pembuat voucher tidak valid");
                }
            } else {
                throw new Error("Voucher tidak ditemukan");
            }
        }).then(async (VoucherAccount) => {
            let WalletSender = await Wallet.findOne({ user: VoucherAccount.sender, active: true });
            if(WalletSender){
                WalletSender.balance += VoucherAccount.saldo;
                WalletSender.validate();
                WalletSender.save();
                VoucherAccount.receiver=id;
                VoucherAccount.validate();
                VoucherAccount.save();
                return VoucherAccount;
            }else{
                throw new Error("Wallet penerima tidak ditemukan");
            }
        }).then((Voucher)=>{
            res.status(200).json({
                message:"Voucher berhasil di cairkan",
                Voucher
            });
        }).catch(next);
    }

}

module.exports = VoucherPengguna;