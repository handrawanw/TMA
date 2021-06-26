const User=require("../models/User");
const {generateToken}=require("../helpers/jwt");

const {md5}=require("../helpers/utils");

class Pengguna {

    static createUser(req,res,next){
        const {email,password,full_name}=req.body;
        User.create({
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

    static loginOne(req,res,next){
        const {email,password}=req.body;
        let hash=md5({payload:password});
        User.findOne({
            email,password:String(hash),
        },["email","full_name"]).then(async(data)=>{
            if(data){
                let token=await generateToken({id:data._id,payload:data});
                res.status(200).json({
                    message:"Login berhasil",
                    token,
                    data,
                })
            }else{
                throw new Error(`Username atau Password yang anda masukan salah`);
            }
        }).catch(next);
    }

    static getAll(req,res,next){
        User.find({},["email","full_name","createdAt","updatedAt"]).then((User)=>{
            res.status(200).json({
                message:"Successfull",
                User
            });
        }).catch(next);
    }

}

module.exports=Pengguna;