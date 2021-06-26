const Cryptr=require("cryptr");
const crypto=require("crypto");

class Utils {
    
    static AesEncrypt({payload=""}){
        const EnkripsiAes=new Cryptr(process.env.PASSWORD_ENC);
        return EnkripsiAes.encrypt(payload);
    }

    static AesDecrypt({payload=""}){
        const EnkripsiAes=new Cryptr(process.env.PASSWORD_ENC);
        return EnkripsiAes.decrypt(payload);
    }

    static md5({payload=""}){
        const kripto=crypto.createHash("md5");
        let mssg=kripto.update(payload).digest("hex");
        return String(mssg);
    }

}

module.exports=Utils;