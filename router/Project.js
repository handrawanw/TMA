const express=require("express");
const Router=express.Router();

const {AuthJwt}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {
    createProject, myProject
}=require("../controller/Project");

Router.post("/create",AuthJwt,validate("ValidateLepCreate"),viewValidateError,createProject);

Router.get("/my",AuthJwt,myProject);

module.exports=Router;