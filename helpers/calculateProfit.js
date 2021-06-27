const {
    CategoryDetail
}=require("../models");

class CalculateProfit {

    static async ResultCalculateProfit({category_project=null,frozen_balance}){
        let ProjectDetail=await CategoryDetail.findOne({category:category_project});
        if(ProjectDetail){

        }else{
            return {
                profit:0,
                remaining_time:0,
                profit_generated:0,
            };
        }
    }

}

module.exports=CalculateProfit;