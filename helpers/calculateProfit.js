const {
    CategoryDetail
}=require("../models");

const {
    DateMsExport
}=require("./utils");
class CalculateProfit {

    static ResultCalculateProfit({category_project="EMPTY",frozen_balance}){
        return CategoryDetail.findOne({category:category_project}).then((ProjectDetail)=>{
            const {_1days}=DateMsExport;
            if(ProjectDetail){
                return {
                    remaining_time:Date.now()+ProjectDetail.session_time,
                    profit_generated:0,
                    ProjectDetail
                };
            }else{
                return {
                    profit:0,
                    remaining_time:0,
                    profit_generated:0,
                    ProjectDetail
                };
            }
        });
    }

}

module.exports=CalculateProfit;