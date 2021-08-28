const jwt=require("jsonwebtoken");

class JWT {

    static generateToken({id,payload}){
        const KUNCI=process.env.JWT_KUNCI;
        return new Promise((resolve,reject)=>{
            jwt.sign({
                id,
                payload,
                // iat: Math.floor(Date.now() / 1000) - 30
            },KUNCI,{algorithm:"HS512"},(err,token)=>{
                if(err) throw reject(err);
                resolve(token);
            });
        });
    }

    static VerifyToken({token}){
        const KUNCI=process.env.JWT_KUNCI;
        return new Promise((resolve,reject)=>{
            jwt.verify(token,KUNCI,(err,decoded)=>{
                if(err) throw reject(err);
                resolve(decoded);
            });
        });
    }

}

module.exports=JWT;