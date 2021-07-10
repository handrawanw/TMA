const {VerifyToken}=require("../helpers/jwt");
const {OtpVerify,OtpGenerate}=require("otp-cache");

class Auth {

    static AuthOtpGenerate(req,res,next){
        OtpGenerate({digits:32,type_code:"alphanumeric",time:60}).then((OTP)=>{
            req.OTP=OTP;
            next();
        }).catch(next);
    }

    static AuthOtpVerify(req,res,next){
        const {token}=req.params;
        OtpVerify({otp_code:String(token)}).then(()=>{
            next();
        }).catch(next); 
    }

    static AuthJwt(req,res,next){
        const {token}=req.headers;
        VerifyToken({token}).then((decoded)=>{
            req.decoded=decoded;
            next();
        }).catch(next);
    }

    static AuthRoleUser(req,res,next){
        const {role}=req.decoded.payload;
        if(role===0){
            next();
        }else{
            throw new Error("Akses 0 tidak di izinkan");
        }
    }

    static AuthRoleAdmin(req,res,next){
        const {role}=req.decoded.payload;
        if(role===1){
            next();
        }else{
            throw new Error("Akses 1 tidak di izinkan");
        }
    }

}

module.exports=Auth;