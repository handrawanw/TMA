const {VerifyToken}=require("../helpers/jwt");

class Auth {

    static AuthJwt(req,res,next){
        const {token}=req.headers;
        VerifyToken({token}).then((decoded)=>{
            req.decoded=decoded;
            next();
        }).catch(next);
    }

}

module.exports=Auth;