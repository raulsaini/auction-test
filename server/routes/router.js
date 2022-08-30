"use strict";
const express = require("express");
const route = express.Router();
const HomeRoute = require("../controller/homeRoute");
const AuctionRoute = require("../controller/auction/auctionController");
const BidRoute = require("../controller/bid/bidController");
const UserRoute = require("../controller/user/userController")

//------------------------------ API----------------------------------
//Home Route
route.get("/", HomeRoute.home);

// * route

//auction
route.post("/create-auction", AuctionRoute.createAuction);
route.get("/get-running-auction", AuctionRoute.getRunningAuction);
route.get("/get-all-auction", AuctionRoute.getAllAuction);
route.get("/get-one-auction",AuctionRoute.getOneAuction);
route.get("/user-auction",AuctionRoute.fetchUserAuction);
route.post("/auction-transfer",AuctionRoute.transferAuction);
route.get("/user-autobid-refunds",AuctionRoute.refundBid);
route.get("/user-failed-refunds",AuctionRoute.failedBid);
route.post("/send-failed-refunds",AuctionRoute.sendFailedRefund);
route.post("/send-auto-refunds",AuctionRoute.sendAutoBidRefund);


//Bid
route.post("/create-bid", BidRoute.createBid);
route.post("/update-bid", BidRoute.updateBid);
route.post("/max-bid", BidRoute.maxBid);
route.get("/user-bid-data", BidRoute.UserBidData);
route.get("/verify-amount", BidRoute.verifyBid);
route.post("/test",BidRoute.test);
route.get("/verify-amount", BidRoute.verifyBid);
route.get("/bidDetails", BidRoute.bidDetails);

//user
route.post("/create-user",UserRoute.addUser);
route.get("/check-user",UserRoute.checkUser);




route.use((req, res, next) => {
    res.status(401).send({ success: false, msg: "Route not found", data: {}, errors: '' });
});



/*route.get('*',()=>{
    res.status(401).send({ success: false, msg: "Route not found", data: {}, errors: '' });
})
route.post('*',()=>{
    res.status(401).send({ success: false, msg: "Route not found", data: {}, errors: '' });
})*/




module.exports = route;



