const express=require("express");
const Router=express.Router();

const {AuthJwt}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {loginOne,createUser, getAll,verifyEmail}=require("../controller/User");

Router.post("/login",validate("login"),viewValidateError,loginOne);

Router.post("/daftar",validate("daftar"),viewValidateError,createUser);

Router.patch("/verify/:id_user",verifyEmail);

Router.get("/all",AuthJwt,getAll);

module.exports=Router;