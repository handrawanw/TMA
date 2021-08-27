const mongoose = require("mongoose");
const Account = require("../models/Account");
const OrderTx = require("../models/Order");

class Tx {

    static createAccount(req, res, next) {
        const { id } = req.decoded;
        const { currency } = req.body;
        Account.create({ user: id, currency }).then((data) => {
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
        session.startTransaction({
            readConcern: { level: "snapshot" }, writeConcern: "majority"
        });
        await session.incrementTransactionNumber();

        try {
            let Remaining = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? Number(amount) : Number(amount) * Number(price) || 0;
            let STypes = side && typeof (side) === "string" && side.toUpperCase() === "BUY" ? base : quote;
            let WalletAccount = await Account.findOne({ user: id, currency: STypes }).session(session);
            let Saldo = WalletAccount && WalletAccount.balance > 0 && WalletAccount.balance;
            if (Saldo < Remaining) {
                throw new Error("Maaf saldo anda tidak cukup");
            }
            
            let TxOrder = await OrderTx.find({}).session(session);
            let Market = Object.assign([], TxOrder);
            let MakerOrder=[];
            let TakerOrder=[];

            if (TxOrder.length > 0) {
                for (let item of Market) {
                    item.total = item.price * item.amount;
                    if (Remaining > 0) {
                        if (Remaining >= item.total) {
                            item.purchased = item.amount;
                            Remaining -= item.total;
                            item.funds = item.price * item.purchased;
                            item.amount = 0;
                            item.total = 0;
                        } else if (Remaining < item.total) {
                            item.purchased = Remaining / item.price;
                            item.total -= Remaining;
                            item.amount -= item.purchased;
                            item.funds = item.price * item.purchased;
                            Remaining = 0;
                        }
                    } else {
                        break;
                    }

                    if (item.hasOwnProperty("purchased")) {

                        if(side&&side.toUpperCase()==="BUY"){
                            let ReceiveCryptoBuy=await Account.findOne({user:item.user,currency:quote}).session(session);
                            if(ReceiveCryptoBuy){
                                ReceiveCryptoBuy.balance+=item.purchased;
                                await ReceiveCryptoBuy.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                            let ReduceBalanceBuy=await Account.findOne({user:item.user,currency:base}).session(session);
                            if(ReduceBalanceBuy){
                                ReduceBalanceBuy.balance-=item.purchased*price;
                                await ReduceBalanceBuy.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                        }else if(side&&side.toUpperCase()==="SELL"){
                            let ReceiveCryptoSell=await Account.findOne({user:item.user,currency:base}).session(session);
                            if(ReceiveCryptoSell){
                                ReceiveCryptoSell.balance+=item.purchased*price;
                                await ReceiveCryptoSell.save({session});
                            }else{
                                Remaining+=item.funds;
                                await session.abortTransaction();
                            }
                            let ReduceBalanceSell=await Account.findOne({user:item.user,currency:quote}).session(session);
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

            console.log(Saldo >= Remaining,Saldo,Remaining)
            if (Remaining > 0) {
                if (Saldo >= Remaining) {
                    WalletAccount.balance -= Number(amount);
                    let TxStatus = await WalletAccount.save({ session });
                    if (TxStatus) {
                        if (side && typeof (side) === "string" && side.toUpperCase() === "SELL") {
                            MakerOrder=await OrderTx.create([{
                                user: id,
                                base: "USDT",
                                quote: "BTC",
                                type: type,
                                side: side,
                                price: price,
                                amount: Remaining
                            }], { session });
                        } else if (side && typeof (side) === "string" && side.toUpperCase() === "BUY") {
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
                        if (session.inTransaction()) {
                            await session.commitTransaction();
                        }
                        res.status(200).json({
                            message: "Successfull",
                            Order:MakerOrder
                        });
                    } else {
                        throw new Error("Transaksi gagal dibuat");
                    }
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