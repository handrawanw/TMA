const {createTransport}=require("nodemailer");
const {OtpGenerate}=require("otp-cache");
class Mailer {

    static EmailRegister(req,res,next){
        const CONFIG={
            USER:process.env.EMAIL_USER,
            PASS:process.env.EMAIL_PASS
        };
        let transporter=createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:CONFIG.USER,
                pass:CONFIG.PASS
            }
        });
        let options={
            to:"handrawanwawan012@gmail.com",
            from:CONFIG.USER,
            subject:`Email Verifikasi`,
            text:`Link verifikasi email http://localhost:2021/emailVerify/${OTP}`,
        };
        transporter.sendMail(options,(error,info)=>{
            if(error){
                res.status(500).json({
                    message:error.message,
                    status:500
                });
            }else{
                res.status(200).json({
                    message:`Email sudah terkirim`,
                    status:200
                });
            }
        });
    }

}

module.exports=Mailer;