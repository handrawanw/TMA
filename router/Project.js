const express=require("express");
const Router=express.Router();

const {AuthJwt,AuthRoleAdmin}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {
    createProject
}=require("../controller/Project");

Router.post("/create",AuthJwt,createProject);

module.exports=Router;