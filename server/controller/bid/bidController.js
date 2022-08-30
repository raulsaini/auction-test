const Web3 = require("web3");
const bidModel = require("../../model/bidModel");
const unconfirmBidModel = require("../../model/unconfirmBidModel");
const auctionModel = require("../../model/auctionModel");
const userModel = require("../../model/userModel");
const Validator = require('../validationController');
const dotenv = require('dotenv');
const web3 = new Web3("https://ropsten.infura.io/v3/526047abd7564a5baff8fb902643a160")

dotenv.config();
const bidDetails = require('../../model/bidDetailsModel');

exports.createBid = async (req, res) =>{
    // try{
        let data = Validator.checkValidation(req.body);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        console.log("data-data", data)
        const userAddress = (data.user).toUpperCase();
        let update;
        let auctionData = await auctionModel.find({_id:data.auctionid,runningStatus:true}).exec();
        let bidData = await bidModel.find({auctionId:data.auctionid,userAddress: userAddress}).exec();
        const receipt = await web3.eth.getTransaction(data.txhash);
        console.log("auctionData receipt", receipt)
        console.log("auctionData", receipt.to)        
            if(auctionData.length > 0){
                if(receipt.to.toUpperCase() == auctionData[0].wallet.toUpperCase() && receipt.from.toUpperCase() == userAddress && Number(receipt.value)/10**18 == Number(data.amount)){
                    auctionData = auctionData[0];
                    let now = parseInt((new Date()).getTime()/1000);
                    if(auctionData.endTime > now){
                        if(bidData.length > 0){
                            bidData = bidData[0];
                            let filter = {_id:bidData._id};
                            if(Number(data.amount) > 0.01){
                                let autoAmount = parseFloat((Number(data.amount) - 0.01)).toPrecision(1);
                                console.log("testing amount", Number(autoAmount)+bidData.totalAutoBidAmount)
                                if((Number(autoAmount)+Number(bidData.totalAutoBidAmount)) <= 0.05){
                                    if(Number(bidData.autoBidTime) > 0){
                                        update = {  
                                            autoBidAmount:parseFloat((Number(bidData.autoBidAmount)+Number(autoAmount))).toPrecision(1),
                                            totalAutoBidAmount:parseFloat((Number(bidData.totalAutoBidAmount)+Number(autoAmount))).toPrecision(1),
                                            bidCount:(auctionData.bidCount+1),
                                            totalBids:(bidData.totalBids+1),
                                            txHash:data.txhash
                                        }
                                    }else{
                                        const autoTime = parseInt(((new Date()).getTime())/1000);
                                        update = {  
                                            autoBidAmount:parseFloat((Number(bidData.autoBidAmount)+Number(autoAmount))).toPrecision(1),
                                            totalAutoBidAmount:parseFloat((Number(bidData.totalAutoBidAmount)+Number(autoAmount))).toPrecision(1),
                                            bidCount:(auctionData.bidCount+1),
                                            totalBids:(bidData.totalBids+1),
                                            txHash:data.txhash,
                                            autoBidTime : autoTime
                                        }
                                    }
                                    
                                }else{
                                    return res.status(203).send({ success: false, msg: "Total auto bid amount exceeding from auto bid limit", data: '', errors: '' });
                                }
                            }else if(Number(data.amount) == 0.01){
                                update = {bidCount:(auctionData.bidCount+1),totalBids:(bidData.totalBids+1),txHash:data.txhash}
                            }else{
                                return res.status(203).send({ success: false, msg: "Error while procedding with your amount", data: '', errors: '' });
                            }
                            bidModel.findOneAndUpdate(filter,update).then(async (existData)=>{
                                if(existData){
                                    let nextTime = parseInt((new Date()).getTime()/1000)+90;
                                    const filter = {_id:data.auctionid};
                                    const update = {endTime:nextTime,lastBidder:userAddress,bidCount:(auctionData.bidCount+1)};
                                    auctionModel.findOneAndUpdate(filter,update).then((updateData)=>{
                                        if(updateData){
                                            res.status(200).send({ success: true, msg: "Bid added successfully", data: update,  errors: '' });
                                        }else{
                                            res.status(200).send({ success: true, msg: "Error while proceeding your request", data: '',  errors: '' });
                                            console.log("Err while updating auction record");
                                        }
                                    })
                                }else{
                                    const unconfirmTX = await unconfirmUpdate(data);
                                    if(unconfirmTX){
                                        return res.status(203).send({ success: false, msg: "Your Bid failed, Amount will be refunded", data: '', errors: '' });
                                    }else{
                                        console.log("error in seving unconfirm data")
                                    }
                                }
                                
                            })
                        }else{
                            let newData;
                            if(Number(data.amount) == 0.01){
                                console.log('abcd',auctionData)
                                newData = new bidModel({
                                    auctionId: data.auctionid,
                                    userAddress: userAddress,
                                    bidCount : (auctionData.bidCount+1),
                                    txHash:data.txhash
                                });
                            }else if(Number(data.amount) > 0.01 && Number(data.amount) <= 0.06){
                                const autoAmount = parseFloat((Number(data.amount) - 0.01)).toPrecision(1);
                                const autoTime = parseInt(((new Date()).getTime())/1000);
                                newData = new bidModel({
                                    auctionId: data.auctionid,
                                    userAddress: userAddress,
                                    autoBidAmount : autoAmount,
                                    totalAutoBidAmount : autoAmount,
                                    autoBidTime : autoTime,
                                    bidCount : (auctionData.bidCount+1),
                                    txHash:data.txhash
                                });
                            }else if(Number(data.amount) < 0.01 || Number(data.amount) > 0.06){
                                return res.status(203).send({ success: false, msg: "Amount should be greate than 0.01 ETH and less than 0.06 ETH", data: '', errors: '' });
                            }
                            newData.save(newData).then(async(biddata) => {  
                                if(biddata){
                                    let nextTime = parseInt((new Date()).getTime()/1000)+90;
                                    const filter = {_id:data.auctionid};
                                    const update = {endTime:nextTime,lastBidder:userAddress,bidCount:(auctionData.bidCount+1)};
                                    auctionModel.findOneAndUpdate(filter,update).then((updateData)=>{
                                        if(updateData){
                                            res.status(200).send({ success: true, msg: "Bid added successfully", data: update,  errors: '' });
                                        }else{
                                            res.status(200).send({ success: true, msg: "Error while proceeding your request", data: '',  errors: '' });
                                            console.log("Err while updating auction record");
                                        }
                                    })
                                            
                                    // res.status(200).send({ success: true, msg: "Bid added successfully", data: biddata,  errors: '' });
                                }else{
                                    const unconfirmTX = await unconfirmUpdate(data);
                                    if(unconfirmTX){
                                        return res.status(203).send({ success: false, msg: "Your Bid failed, Amount will be refunded", data: '', errors: '' });
                                    }else{
                                        console.log("error in seving unconfirm data")
                                    }
                                }
                            }).catch(err => {
                                console.log(err)
                                res.status(500).send({success: false,message: err.message || "Some error occurred while creating a create operation of bid"});
                            })

                        }
                    }else{
                        const unconfirmTX = await unconfirmUpdate(data);
                        if(unconfirmTX){
                            return res.status(203).send({ success: false, msg: "Your Bid failed, Amount will be refunded", data: '', errors: '' });
                        }else{
                            console.log("error in seving unconfirm data")
                        }
                    }
                }else{
                    res.status(203).send({ success: false, msg: "Invalid transaction", data: {}, errors: '' });
                }
       
            }else{
                let auctionData1 = await auctionModel.find({_id:data.auctionid}).exec();
                if(receipt.to.toUpperCase() == auctionData1[0].wallet.toUpperCase() && receipt.from.toUpperCase() == userAddress && Number(receipt.value)/10**18 == Number(data.amount)){
                    const unconfirmTX = await unconfirmUpdate(data);
                    if(unconfirmTX){
                        return res.status(203).send({ success: false, msg: "Your Bid failed, Amount will be refunded", data: '', errors: '' });
                    }else{
                        console.log("error in seving unconfirm data")
                    }
                }else{
                    res.status(203).send({ success: false, msg: "Invalid transaction", data: {}, errors: '' });
                }
                // return res.status(203).send({ success: false, msg: "Auction is over", data: '', errors: '' });
            }
        
    // }catch (err) {
    //     console.error(err);
    //     res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    // }
}

exports.UserBidData = (req,res)=>{
    try{
        let data = Validator.checkValidation(req.query);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }

        let userAddress = (data.address).toUpperCase()
        bidModel.find({auctionId: data.auctionid,userAddress:userAddress},{amount:1}).sort({amount:-1}).limit(1).then((bidData)=>{
            if(bidData.length > 0){
                console.log(bidData)
                return res.status(200).send({ success: true, msg: "found data", data: bidData[0].amount, errors: '' });
            }else{
                return res.status(200).send({ success: false, msg: "No data found", data: 0, errors: '' });
            }   
        })
   
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
}

async function unconfirmUpdate(data){
    return new Promise((resolve,reject)=>{
        const user =  (data.user).toUpperCase();
        unconfirmBidModel.find({auctionId: data.auctionid,userAddress: user}).then((unconfirmData)=>{
            if(unconfirmData.length > 0){
                unconfirmBidModel.findOneAndUpdate({_id:unconfirmData[0]._id},{amount:(Number(data.amount)+Number(unconfirmData[0].amount))}).then((update)=>{
                    if(update){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                })
            }else{
                const newData = new unconfirmBidModel({
                    auctionId: data.auctionid,
                    userAddress: user,
                    txHash: data.txhash,
                    amount: data.amount
                });
                newData.save(newData).then((data)=>{
                    if(data){
                        resolve(true);   
                    }else{
                        resolve(false)
                    }
                })
            }
        })
        
    })
}

async function confirmUpdate(data, bidData,bidCount){
    return new Promise((resolve,reject)=>{
                let nextTime = parseInt((new Date()).getTime()/1000)+90;
                const filter = {_id:data.auctionid};
                const update = {endTime:nextTime,lastBidder:bidData.userAddress,bidCount:(bidCount+1)};
                auctionModel.findOneAndUpdate(filter,update).then((updateData)=>{
                    if(updateData){
                        resolve(update);
                    }else{
                        console.log("Err while updating auction record");
                        resolve(false);
                    }
                })
        })  
}

exports.updateBid = async (req, res) =>{
    try{
        let data = Validator.checkValidation(req.body);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        let auctionData = await auctionModel.find({_id:data.auctionid});
        let bidData = await bidModel.find({_id:data.id});
        console.log('lllllllll',auctionData)
        auctionData = auctionData[0];
        
        bidData = bidData[0]
            let now = parseInt((new Date()).getTime()/1000);
            if(auctionData.endTime > now){

                let updateData = await confirmUpdate(data,bidData, auctionData.bidCount);
                if(updateData){
                    res.status(200).send({ success: true, msg: "Bid added successfully", data: updateData, errors: '' });
                }
                }else{
                    let unconfirmData = await unconfirmUpdate(data, bidData, auctionData.bidCount);
                    if(unconfirmData){
                        res.status(203).send({ success: false, msg: "Auction is over, your amount will be refunded", data: '',  errors: '' });
                    }
                }  
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
}

exports.maxBid = (req,res) => {
    let data = Validator.checkValidation(req.body);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        auctionModel.find({_id:data.auctionid,runningStatus:true}).countDocuments().then((num)=>{
            if(num>0){
                let address = (data.address).toUpperCase();
                userModel.find({address:address}).then((userData)=>{
                    if(userData.length > 0){
                        if(userData[0].balance > Number(data.amount)){
                            bidModel.find({auctionId:data.auctionid,userAddress:address}).then((bidData)=>{
                                if(bidData.length > 0){
                                    if(bidData[0].maxBid < data.amount){
                                        bidModel.findOneAndUpdate({_id:bidData[0]._id},{maxBid:data.amount}).then((data)=>{
                                            if(data){
                                                res.status(200).send({ success: true, msg: "Max bid amount is set", data: {}, errors: '' });
                                            }else{
                                                res.status(203).send({ success: false, msg: "Error while setting max Bid amount", data: {}, errors: '' });
                                            }
                                        })
                                    }else{
                                        res.status(203).send({ success: false, msg: "Amount is lower then your last max bid", data: {}, errors: '' });
                                    }
                                }else{
                                    res.status(203).send({ success: false, msg: "Bid not found ! please place a bid first ", data: {}, errors: '' });
                                }
                            })
                        }else{
                            res.status(203).send({ success: false, msg: "Your deposit balance is low", data: {}, errors: '' });
                        }
                    }else{
                        res.status(203).send({ success: false, msg: "User not found", data: {}, errors: '' });
                    }
                })
            }else{
                res.status(203).send({ success: false, msg: "Auction is closed", data: {}, errors: '' });
            }
        })
}

exports.verifyBid = (req,res) =>{
    try{
        let data = Validator.checkValidation(req.query);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        console.log('data',data)
        let amount = parseFloat((Number(data.amount) - 0.01)).toPrecision(1);
        let userAddress = (data.user).toUpperCase()
        bidModel.find({auctionId: data.auctionid,userAddress:userAddress}).then((bidData)=>{
            if(bidData.length > 0){
                if((Number(bidData[0].autoBidAmount)+Number(amount)) <= 0.05 && (Number(bidData[0].totalAutoBidAmount)+Number(amount) <= 0.05)){
                    return res.status(200).send({ success: true, msg: "found data", data: bidData[0].amount, errors: '' });
                }else{
                   return res.status(200).send({ success: false, msg: "Please enter valid amount", data: bidData[0].amount, errors: '' });
                }    
            }else{
                if(amount <= 0.05){
                    return res.status(200).send({ success: true, msg: "No data found", data: 0, errors: '' });
                }else{
                    return res.status(200).send({ success: false, msg: "No data found", data: 0, errors: '' });
                }  
            }   
        })
   
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
}

exports.test =(req,res) =>{
    let data = req.body;
    const user =  (data.user).toUpperCase();
    unconfirmBidModel.find({auctionId: data.auctionid,userAddress: user}).then((unconfirmData)=>{
        if(unconfirmData){
            console.log('unconfirmData',unconfirmData);
        }else{
            const newData = new unconfirmBidModel({
                auctionId: data.auctionid,
                userAddress: user,
                txHash: data.txhash,
                amount: data.amount
            });
            newData.save(newData).then((data)=>{
                if(data){
                    resolve(true);   
                }
            })
        }
    })
}







exports.bidDetails =async (req,res)=> {
    try{
        let userAuctionId = req.query.id;
        let biddata = await bidModel.find({auctionId:userAuctionId}) 
        if(biddata.length > 0){
            res.status(500).send({ success: true, msg: "", data: biddata});              
            }
            else{
                res.status(500).send({ success: false, msg: "no data found" });   
            }
        }catch (err) {
            console.error(err);
            res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
        }
    }