const {
    Project,
    CategoryDetail,
    Wallet
}=require("../models");

class LEPProject {

    static createProject(req,res,next){
        const {id}=req.decoded;
        const {
            frozen_balance,
            category_project
        }=req.body;
        CategoryDetail.findOne({category:category_project}).then((ProjectDetail)=>{
            if(ProjectDetail){
                if(frozen_balance>=ProjectDetail.min_balance&&frozen_balance<=ProjectDetail.max_balance){
                    return ProjectDetail;
                }else{
                    throw new Error(`Maaf frozen balance harus dalam range ${ProjectDetail.min_balance}-${ProjectDetail.max_balance}`)
                }
            }else{
                throw new Error("Daftar Project tidak ditemukan");
            }
        }).then(async(ProjectDetail)=>{
            let WalletId=await Wallet.findOne({user:id});
            if(WalletId){
                if(WalletId.balance>=frozen_balance){
                    WalletId.balance-=frozen_balance;
                    await WalletId.save();
                    return ProjectDetail;
                }else{
                    throw new Error(`Maaf saldo anda ${WalletId.balance} tidak mencukupi`);
                }
            }else{
                throw new Error(`Wallet tidak ditemukan`);
            }
        }).then(async(ProjectDetail)=>{
            let OrderProject=await Project.create({
                expired:Date.now()+ProjectDetail.session_time,
                frozen_balance,
                session_remaining:Date.now()+ProjectDetail.session_time,
                detail_project:ProjectDetail._id
            });
            res.status(200).json({
                message:`Paket ${ProjectDetail.category} berhasil ditambahkan`,
                OrderProject
            });
        }).catch(next);
    }

}

module.exports=LEPProject;