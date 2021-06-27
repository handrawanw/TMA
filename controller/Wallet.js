const {Wallet}=require("../models");

class WalletPengguna {

    static getAllWallet(req,res,next){
        Wallet.find({}).then((Wallet)=>{
            res.status(200).json({
                message:"Successfull",
                Wallet
            });
        }).catch(next);
    }

    static getOneWallet(req,res,next){
        const {id}=req.decoded;
        const {id_wallet}=req.params;
        
        Wallet.findOne({_id:id_wallet,user:id}).then((Wallet)=>{
            res.status(200).json({
                message:"Successfull",
                Wallet
            });
        }).catch(next);
    }

}

module.exports=WalletPengguna;