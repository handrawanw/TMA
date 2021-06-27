const express=require("express");
const Router=express.Router();

const {AuthJwt,AuthRoleAdmin,AuthRoleUser}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {
    depositVoucher,depositSender,
    topUpBalance,withdrawVoucherReject,
    withdrawReceiver,withdrawVoucher,
    setorCodeVoucher,depositSenderReject
}=require("../controller/TopUp");

// deposit
Router.post("/deposit",AuthJwt,validate("createVoucher"),viewValidateError,depositVoucher);
Router.get("/deposit",AuthJwt,depositSender);
Router.delete("/deposit/:id_voucher",AuthJwt,AuthRoleUser,validate("voucherIdParams"),viewValidateError,depositSenderReject);
// deposit

// withdraw
Router.post("/withdraw",AuthJwt,validate("withdrawVoucher"),viewValidateError,withdrawVoucher);
Router.get("/withdraw",AuthJwt,withdrawReceiver);
Router.delete("/withdraw/:id_voucher",AuthJwt,AuthRoleUser,validate("voucherIdParams"),viewValidateError,withdrawVoucherReject);
// withdraw

Router.patch("/setorkan/:id_voucher",AuthJwt,AuthRoleAdmin,validate("voucherIdParams"),viewValidateError,setorCodeVoucher);
Router.post("/cairkan",AuthJwt,AuthRoleAdmin,validate("cairkanVoucher"),viewValidateError,topUpBalance);

module.exports=Router;