const {
    Wallet,
    Voucher,
    Notification
} = require("../models");

const Select=require("../helpers/select.json");

class VoucherPengguna {

    static depositVoucher(req, res, next) {
        const {id}=req.decoded;
        const { code_voucher_idx, description } = req.body;
        Voucher.findOne({code_voucher_idx,sender:id}).then(async(ValidVoucher)=>{
            if(!ValidVoucher){
                let VoucherOuput=await Voucher.create({
                    code_voucher_idx, description,sender:id,tx_type:"Deposit"
                });
                if (VoucherOuput) {
                    res.status(200).json({
                        message: "Permintaan Deposit Voucher sudah terbuat, silakan tunggu persetujuan admin",
                        VoucherOuput
                    });
                } else {
                    throw new Error("Deposit voucher gagal terbuat, silakan coba lagi !");
                }
            }else{
                throw new Error(`Voucher ini ${code_voucher_idx} sudah digunakan, silakan coba yang lain !`);
            }
        }).catch(next);
    }

    static depositSenderReject(req,res,next){
        const {id}=req.decoded;
        const {id_voucher}=req.params;
        Voucher.findOneAndDelete({
            _id:id_voucher,sender:id,vouchers_received:"Pending",tx_type:"Deposit"
         }).then((Voucher) => {
             if (Voucher) {
                 res.status(200).json({
                     message: "Permintaan Deposit Voucher anda berhasil di batalkan",
                     Voucher
                 });
             } else {
                 throw new Error("Deposit tidak ditemukan, silakan coba lagi !");
             }
         }).catch(next);
    }

    static depositSender(req,res,next){
        const {id}=req.decoded;
        const {status_voucher="Pending"}=req.body;
        Voucher.find({
           sender:id,vouchers_received:status_voucher,tx_type:"Deposit"
        },Select.DepositWithdrawVoucher).then((Voucher) => {
            if (Voucher) {
                res.status(200).json({
                    message: "Permintaan Withdraw Voucher anda",
                    Voucher
                });
            } else {
                throw new Error("Withdraw voucher gagal diproses, silakan coba lagi !");
            }
        }).catch(next);
    }
    

    static withdrawVoucher(req, res, next) {
        const {id}=req.decoded;
        const { description,saldo } = req.body;
        Wallet.findOne({user:id}).then(async(Account)=>{
            if(Account){
                if(Account.balance>=saldo){
                    Account.balance-=Number(saldo);
                    Account.save();
                    let GenerateVoucher=await Voucher.create({
                        description,receiver:id,saldo:Number(saldo),tx_type:"Withdraw"
                    });
                    if (GenerateVoucher) {
                        res.status(200).json({
                            message: "Permintaan Withdraw Voucher sudah terbuat, silakan tunggu persetujuan admin",
                            Voucher:GenerateVoucher
                        });
                    } else {
                        throw new Error("Withdraw Voucher gagal diproses, silakan coba lagi !");
                    }
                }else{
                    throw new Error(`Saldo Anda ${Account.balance} tidak mencukupi untuk withdraw sebesar ${saldo}`);
                }
            }else{
                throw new Error("Wallet tidak ditemukan");
            }
        }).catch(next);
    }

    static withdrawVoucherReject(req, res, next) {
        const {id}=req.decoded;
        const {id_voucher}=req.params;
        Voucher.findOne({_id:id_voucher,vouchers_received:"Pending",receiver:id,sender:undefined,code_voucher_idx:"-"}).then(async(VoucherRedem)=>{
            if(VoucherRedem){
                let WalletSender=await Wallet.findOne({user:id});
                if(WalletSender){
                    WalletSender.balance+=VoucherRedem.saldo;
                    await WalletSender.save();
                    await VoucherRedem.delete();
                    res.status(200).json({
                        message:`Voucher berhasil dicancel`,
                        VoucherRedem 
                    });
                }else{
                    throw new Error(`Wallet tidak ditemukan`);
                }
            }else{
                throw new Error(`Voucher tidak ditemukan, silakan coba lagi !!`);
            }
        }).catch(next);
    }

    static withdrawReceiver(req,res,next){
        const {id}=req.decoded;
        const {status_voucher="Pending"}=req.body;
        Voucher.find({
           receiver:id,vouchers_received:status_voucher,tx_type:"Withdraw"
        },Select.DepositWithdrawVoucher).then((Voucher) => {
            if (Voucher) {
                res.status(200).json({
                    message: "Permintaan Withdraw Voucher anda",
                    Voucher
                });
            } else {
                throw new Error("Withdraw voucher gagal diproses, silakan coba lagi !");
            }
        }).catch(next);
    }

    static setorCodeVoucher(req,res,next){
        const {id}=req.decoded;
        const {id_voucher}=req.params;
        const {code_voucher_idx}=req.body;
        Voucher.findOne({_id:id_voucher,vouchers_received:"Pending",tx_type:"Withdraw"}).populate("receiver").then(async(VoucherAccount)=>{
            if(VoucherAccount){
                VoucherAccount.sender=id;
                VoucherAccount.code_voucher_idx=code_voucher_idx;
                VoucherAccount.vouchers_received="Approved";
                await VoucherAccount.save();
                await Notification.create({
                    user:VoucherAccount.receiver._id,
                    tx_status:"Deposit Diterima",
                    title:"Deposit Voucher",
                    description:`Hallo ${VoucherAccount.receiver.full_name},
                        Withdraw anda sudah kami proses, 
                        Kode Voucher ${VoucherAccount.code_voucher_idx}
                        dengan saldo ${VoucherAccount.saldo}.
                        Terima kasih telah menggunakan TMA(Trader My Asset),
                    `
                });
                res.status(200).json({
                    message:`Kode Voucher ${VoucherAccount.code_voucher_idx} berhasil disetor`,
                    Voucher:VoucherAccount
                });
            }else{
                throw new Error("Voucher tidak ditemukan");
            }
        }).catch(next);
    }

    static topUpBalance(req, res, next) {
        const {id}=req.decoded;
        const { code_voucher_idx, email, saldo } = req.body;
        Voucher.findOne({ code_voucher_idx,vouchers_received:"Pending" }).populate("sender").then((VoucherAccount) => {
            if (VoucherAccount) {
                if (VoucherAccount.sender&&VoucherAccount.sender.email === email) {
                    VoucherAccount.saldo = saldo;
                    VoucherAccount.receiver=id;// FOREIGN KEY RECEIVER
                    VoucherAccount.vouchers_received="Approved";
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
                await Notification.create({
                    user:VoucherAccount.sender._id,
                    tx_status:"Deposit Diterima",
                    title:"Deposit Voucher",
                    description:`Hallo ${VoucherAccount.sender.full_name},
                        Deposit anda sudah kami terima dengan Kode Voucher ${VoucherAccount.code_voucher_idx}
                        dengan saldo ${VoucherAccount.saldo}.
                        Terima kasih telah menggunakan TMA(Trader My Asset),
                    `
                });
                WalletSender.balance += VoucherAccount.saldo;
                WalletSender.save();
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