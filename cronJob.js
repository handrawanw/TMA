const cron=require("node-cron");
const {ResultCalculateProfit}=require("./helpers/calculateProfit");

class CronJobs {

    static HitungProfit(){
        ResultCalculateProfit();
        cron.schedule("*/30 * * * * *",()=>{
            ResultCalculateProfit();
        });
    }

}

module.exports=CronJobs;