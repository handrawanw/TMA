const cron=require("node-cron");
const {ResultCalculateProfit}=require("./helpers/calculateProfit");

class CronJobs {

    static HitungProfit(){
        cron.schedule("*/5 * * * *",()=>{
            ResultCalculateProfit();
        });
    }

}

module.exports=CronJobs;