const mongoose = require("mongoose");
const Account = require("../models/Account");
const OrderTx = require("../models/Order");

class Tx {

    static createAccount(req, res, next) {
        const { id } = req.decoded;
        const { currency, balance } = req.body;
        Account.create({ user: id, currency,balance }).then((data) => {
            res.status(200).json({
                message: "Successfull",
                data
            })
        }).catch(next);
    }

    static async Orders(req, res, next) {
        const { id } = req.decoded;
        const { amount, price, side, type, base, quote } = req.body;
        let session = await mongoose.startSession();

        try {

            let Remaining = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? Number(amount) : Number(amount) * Number(price) || 0;
            let STypes = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? base : quote;
            let STypesOrder = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? "SELL" : "BUY";
            let QPriceOrder = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? {$lte:Number(price)} : {$gte:Number(price)};
            let WalletAccount = await Account.findOne({ user: id, currency: STypes, balance:{$gte:0}, frozen_balance:{$gte:0}}).session(session);
            let Saldo = WalletAccount && WalletAccount.balance > 0 ? WalletAccount.balance:0;

            if (Saldo < Number(amount)) {
                throw new Error("Maaf saldo anda tidak cukup");
            }
            
            let TxOrder = await OrderTx.find({side:STypesOrder,price:QPriceOrder,amount:{$gt:0}}).session(session);
            let Market = Object.assign([], TxOrder);
            let MakerOrder=[];
            let TakerOrder=[];

            if (TxOrder.length > 0) {
                for (let item of Market) {
                    session.startTransaction({
                        readConcern: { level: "snapshot" }, writeConcern: "majority"
                    });
                    await session.incrementTransactionNumber();
                    if (Remaining > 0) {
                        item.total = Number(item.price * item.amount);
                        if (Remaining >= item.total) {
                            item.purchased = item.amount;
                            Remaining -= item.total;
                            item.amount = 0;
                            item.total = item.price * item.amount;
                            item.funds = item.purchased * item.price;
                        } else if (Remaining < item.total) {
                            item.purchased = Remaining / item.price;
                            item.amount -= item.purchased;
                            Remaining = 0;
                            item.total = item.price * item.amount;
                            item.funds = item.purchased * item.price;
                        }
                    } else {
                        break;
                    }

                    if (item.hasOwnProperty("purchased")) {

                        if(side&&side.toUpperCase()==="BUY"){
                            let ReceiveCryptoBuy=await Account.findOne({user:item.user, currency:quote, balance:{$gte:0}, frozen_balance:{$gte:0}}).session(session);
                            if(ReceiveCryptoBuy){
                                ReceiveCryptoBuy.balance+=item.purchased;
                                await ReceiveCryptoBuy.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                            let ReduceBalanceBuy=await Account.findOne({user:item.user, currency:base, balance:{$gte:0}, frozen_balance:{$gte:0}}).session(session);
                            if(ReduceBalanceBuy){
                                ReduceBalanceBuy.balance-=item.purchased*price;
                                await ReduceBalanceBuy.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                        }else if(side&&side.toUpperCase()==="SELL"){
                            let ReceiveCryptoSell=await Account.findOne({user:item.user, currency:base, balance:{$gte:0}, frozen_balance:{$gte:0}}).session(session);
                            if(ReceiveCryptoSell){
                                ReceiveCryptoSell.balance+=item.purchased*price;
                                await ReceiveCryptoSell.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                            let ReduceBalanceSell=await Account.findOne({user:item.user, currency:quote, balance:{$gte:0}, frozen_balance:{$gte:0}}).session(session);
                            if(ReduceBalanceSell){
                                ReduceBalanceSell.balance-=item.purchased;
                                await ReduceBalanceSell.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                        }

                        await OrderTx.findOneAndUpdate({
                            user:item.user,
                            _id:item._id
                        },{
                            amount:item.amount
                        },{strict:true}).session(session);

                        if (session.inTransaction()) {
                            await session.commitTransaction();
                        }
                        
                    }
                }
            }

            // console.log(Saldo >= Remaining,Saldo,Remaining)
            if (Remaining > 0) {
                if (Saldo >= amount) {
                    WalletAccount.balance -= Number(Remaining);
                    if (side && typeof (side) === "string" && side.toUpperCase() === "SELL") {
                        WalletAccount.balance -= Number(Remaining / price);
                        let TxBuy=await WalletAccount.save({ session });
                        if(TxBuy){
                            MakerOrder=await OrderTx.create([{
                                user: id,
                                base: "USDT",
                                quote: "BTC",
                                type: type,
                                side: side,
                                price: price,
                                amount: Remaining / price,
                            }], { session });
                        }
                    } else if (side && typeof (side) === "string" && side.toUpperCase() === "BUY") {
                        WalletAccount.balance -= Number(Remaining);
                        let TxSell=await WalletAccount.save({ session });
                        if(TxSell){
                            MakerOrder=await OrderTx.create([{
                                user: id,
                                base: "USDT",
                                quote: "BTC",
                                type: type,
                                side: side,
                                price: price,
                                amount: Remaining / price
                            }], { session });
                        }
                    }
                    if (session.inTransaction()) {
                        await session.commitTransaction();
                    }
                    res.status(200).json({
                        message: "Successfull",
                        Order:MakerOrder
                    });
                }
            }else{
                res.status(200).json({
                    message: "Successfull",
                    Order:TakerOrder
                });
            }

        } catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            next(error);
        } finally {
            session.endSession();
        }
    }

}

module.exports = Tx;