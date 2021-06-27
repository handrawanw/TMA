const {
    Project
}=require("../models");

const {
    DateMsExport
}=require("./utils");
class CalculateProfit {
    
    static ResultCalculateProfit(){

        Project.find({}).populate("detail_project").then(async(ProjectStart)=>{
            const {_1days}=DateMsExport;
            for(let item of ProjectStart){
                let sesion_rm=Number(item.expired-Date.now())/_1days;
                let rm_sesi=item.detail_project.session_time;
                let Permenit=Number(rm_sesi/_1days)-sesion_rm;
                let profit_1bulan=Number(item.frozen_balance*item.detail_project.profit_interest)/100;
                let profit_1week=Number(profit_1bulan*item.detail_project.profit_interest_week)/100;
                let Collect=Number(Permenit*profit_1week)+Number(Permenit*profit_1bulan);
                if(Date.now()>item.expired){
                    await Project.findOneAndUpdate({_id:item._id},{
                        progress:"Finish",
                        collected:Collect,
                        session_remaining:sesion_rm,
                    });
                }else{
                    await Project.findOneAndUpdate({_id:item._id},{
                        collected:Collect,
                        session_remaining:sesion_rm,
                    });
                }
            }
        });
    
    }

}

module.exports=CalculateProfit;