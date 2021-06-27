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

    static VoucherRandom(){
        const ran=crypto.randomBytes(512*64);
        let out=ran.toString('hex').toUpperCase().slice(1,64);
        return "BTC-IDR-"+out;
    }

    static DateMsExport(){
        return {
            _1days:86400000,
            _1jam:3600000,
        }
    }

}

module.exports=Utils;