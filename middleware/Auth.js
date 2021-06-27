const {VerifyToken}=require("../helpers/jwt");

class Auth {

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