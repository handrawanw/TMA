const {
    CategoryDetail
}=require("../models");

class CreateProjectDetail {

    static CreateProject(req,res,next){
        const {
            project_name,category,profit_interest,
            profit_interest_week,min_balance,max_balance,
            session_time
        }=req.body;
        CategoryDetail.create({
            project_name,category,profit_interest,
            profit_interest_week,min_balance,max_balance,
            session_time:Number(session_time)
        }).then((Project)=>{
            res.status(200).json({
                message:`Project ${project_name} telah ditambahkan`,
                Project
            });
        }).catch(next);
    }

    static UpdateProject(req,res,next){
        const {id_project}=req.params;
        const {
            project_name,category,profit_interest,
            profit_interest_week,min_balance,max_balance,
            session_time,status_active=true
        }=req.body;
        CategoryDetail.findOneAndUpdate({_id:id_project},{
            project_name,category,profit_interest,
            profit_interest_week,min_balance,max_balance,
            session_time:Number(session_time),status_active
        }).then((Project)=>{
            res.status(200).json({
                message:`Project ${project_name} telah ditambahkan`,
                Project
            });
        }).catch(next);
    }

    static AllProject(req,res,next){
        CategoryDetail.find({}).then((Project)=>{
            res.status(200).json({
                message:`All Project`,
                Project
            });
        }).catch(next);
    }

    static OneProject(req,res,next){
        const {id_project}=req.params;
        CategoryDetail.findOne({_id:id_project}).then((Project)=>{
            res.status(200).json({
                message:`One Project`,
                Project
            });
        }).catch(next);
    }

}

module.exports=CreateProjectDetail;