const express=require("express");
const Router=express.Router();

const {AuthJwt,AuthRoleAdmin}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {CreateProject,AllProject, OneProject,UpdateProject}=require("../controller/CreateProject");

Router.post('/add',AuthJwt,AuthRoleAdmin,validate("ValidateProjectAdd"),viewValidateError,CreateProject);
Router.patch('/update/:id_project',AuthJwt,AuthRoleAdmin,validate("ValidateProjectParamsID"),viewValidateError,UpdateProject);

Router.get("/all",AuthJwt,AllProject);

Router.get("/one/:id_project",AuthJwt,validate("ValidateProjectParamsID"),viewValidateError,OneProject);


module.exports=Router;