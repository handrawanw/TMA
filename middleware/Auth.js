const {VerifyToken}=require("../helpers/jwt");
const {OtpVerify}=require("otp-cache");

const PASSWD=process.env.PASSWD;
class Auth {

    static AuthOTPSecretVerified(req,res,next){
        const {token}=req.body;
        OtpVerify({otp_code:token,secret:PASSWD}).then((OTP)=>{
            req.OTP=OTP;
            next();
        }).catch(next);
    }

    static AuthOTPVerified(req,res,next){
        const {token}=req.body;
        OtpVerify({otp_code:token}).then(()=>{
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