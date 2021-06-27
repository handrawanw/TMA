const {
    UserModel,
    Wallet
}=require("../models");
const {generateToken}=require("../helpers/jwt");

const {md5}=require("../helpers/utils");

const Select=require("../helpers/select.json");

class Pengguna {

    static createUser(req,res,next){
        const {email,password,full_name}=req.body;
        UserModel.create({
            email,
            password:md5({payload:password}),
            full_name
        }).then((Account)=>{
            res.status(200).json({
                message:`${email} sudah berhasil daftar`,
                Account
            });
        }).catch(next);
    }

    static verifyEmail(req,res,next){
        const {id_user}=req.params;
        UserModel.findOne({_id:id_user}).then(async(UserUpdate)=>{
            if(UserUpdate){
                UserUpdate.emailVerification=true;
                await UserUpdate.validate();
                await UserUpdate.save();
                let WalletUserUpdate=await Wallet.findOne({user:UserUpdate._id});
                if(!WalletUserUpdate){
                    await Wallet.create({user:UserUpdate._id});
                }
                res.status(200).json({
                    message:"Email berhasil diverifikasi",
                    User:UserUpdate
                });
            }else{
                throw new Error(`Verifikasi email gagal diupdate`);
            }
        }).catch(next);
    }

    static loginOne(req,res,next){
        const {email,password}=req.body;
        let hash=md5({payload:password});
        UserModel.findOne({
            email,password:String(hash),
        },Select.User).then(async(User)=>{
            if(User){
                if(User.emailVerification){
                    let token=await generateToken({id:User._id,payload:User});
                    return {token,User};
                }else{
                    throw new Error(`Verifikasi email terlebih dahulu`);
                }
            }else{
                throw new Error(`Username atau Password yang anda masukan salah`);
            }
        }).then(({token,User})=>{
            if(!User.banned){
                res.status(200).json({
                    message:"Login berhasil",
                    token,
                    User,
                });
            }else{
                throw new Error(`Akun anda telah di banned`);
            }
        }).catch(next);
    }

    static getOne(req,res,next){
        const {id}=req.decoded;
        UserModel.findOne({_id:id},["email","full_name","createdAt","updatedAt"]).then((User)=>{
            res.status(200).json({
                message:"Successfull",
                User
            });
        }).catch(next);
    }

    static getAll(req,res,next){
        UserModel.find({},["email","full_name","createdAt","updatedAt"]).then((User)=>{
            res.status(200).json({
                message:"Successfull",
                User
            });
        }).catch(next);
    }

}

module.exports=Pengguna;