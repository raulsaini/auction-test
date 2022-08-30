const Web3 = require("web3");
const bidModel = require("../../model/bidModel");
const unconfirmBidModel = require("../../model/unconfirmBidModel");
const auctionModel = require("../../model/auctionModel");
const userModel = require("../../model/userModel");
const Validator = require('../validationController');
const dotenv = require('dotenv');
const web3 = new Web3("https://ropsten.infura.io/v3/526047abd7564a5baff8fb902643a160")
dotenv.config();



exports.bidDetails = (req,res)=>{
    try{
        let bidModelDetails = bidModel.find({auctionId,userAddress,date
        })

        if(bidModelDetails.length > 0){
            for (let i = 0; i < bidModelDetails.length; i++) {
                console.log("bidModelDetails.auctionId" ,i, bidModelDetails[i].auctionId)
                console.log("userAddress", i,bidModelDetails[i].userAddress)
                console.log("date", i,bidModelDetails[i].date)
              }
       
            }
            else{
                console.log("no data found in biddetails table")
            }
        // if (data['success'] === true) {
        //     data = data['data'];
        // } else {
        //     res.status(203).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        // }

        // let userAddress = (data.address).toUpperCase()
        // bidModel.find({auctionId: data.auctionid,userAddress:userAddress},{amount:1}).sort({amount:-1}).limit(1).then((bidData)=>{
        //     if(bidData.length > 0){
        //         console.log(bidData)
        //         return res.status(200).send({ success: true, msg: "found data", data: bidData[0].amount, errors: '' });
        //     }else{
        //         return res.status(200).send({ success: false, msg: "No data found", data: 0, errors: '' });
        //     }   
        // })
   
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
}

