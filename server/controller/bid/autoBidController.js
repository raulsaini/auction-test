const bidModel = require("../../model/bidModel");
const auctionModel = require("../../model/auctionModel");
const userModel = require("../../model/userModel");
const dotenv = require('dotenv');
dotenv.config();


function setAutoBid(auctionData, maxBid,bidCount, auctionDataBidderIndex,count){
    if(count == maxBid.length && count != 1){
        return new Promise((resolve,reject)=>{
            console.log("zero amount failed")
            resolve(true);
        })
    }else{
        let autoAmount = maxBid[auctionDataBidderIndex].autoBidAmount;
        console.log(autoAmount,"autoAmount")
        if(Number(autoAmount) >= 0.01){
            return new Promise((resolve,reject)=>{
                autoAmount = parseFloat((Number(autoAmount) - 0.01)).toPrecision(1);
                // let autoBiddersLength = maxBid.length;
                let totalBids = maxBid[auctionDataBidderIndex].totalBids;
                bidModel.findOneAndUpdate({_id:maxBid[auctionDataBidderIndex]._id},{autoBidAmount:autoAmount,bidCount:(bidCount+1),totalBids:totalBids+1}).then(async(updateData)=>{
                    if(updateData){
                        
                        let nextTime = parseInt((new Date()).getTime()/1000)+90;
                        const filter = {_id:auctionData._id};
                        const user = maxBid[auctionDataBidderIndex].userAddress;
                        let update;
                        let remainingLength = await bidModel.find({auctionId:auctionData._id,autoBidAmount:{$gte:0.01}}).sort({autoBidTime:1});
                        console.log("remaining length",remainingLength.length)
                        if(remainingLength.length < maxBid.length){
                            update = {endTime:nextTime, lastBidder:user, bidCount:(bidCount+1),autoBidderIndex:0};
                        }else {
                            if(auctionDataBidderIndex == maxBid.length-1){
                                update = {endTime:nextTime, lastBidder:user, bidCount:(bidCount+1),autoBidderIndex:0};
                           }else{
                                update = {endTime:nextTime, lastBidder:user, bidCount:(bidCount+1),autoBidderIndex:auctionDataBidderIndex+1};
                           }
                        }
                        auctionModel.findOneAndUpdate(filter,update).then((AuctionUpdate)=>{
                            if(AuctionUpdate){
                                console.log(`auto bid is placed for id ${auctionData._id} for ${user}`);
                                resolve(true);
                            }else{
                                console.log("Err while updating auction record")
                            }
                        }) 
                    }else{
                        console.log("Error while Updatign bid record")
                    }
                })
            })
        }else{
            setAutoBid(auctionData, maxBid,bidCount, auctionDataBidderIndex+1,count+1)
        }
        
    }
    
}

setInterval(async function(){
   
    let now = (Math.floor((new Date()).getTime() / 1000))+11
    auctionModel.find( {endTime: {$lte: now} , runningStatus:true} ).then(async (auctionData)=>{
        if(auctionData.length > 0){

            await Promise.all(
                auctionData.map(async(item)=>{
                    let auctionId = item._id;
                    let auctionDataBidderIndex = item.autoBidderIndex;
                    let bidCount = item.bidCount
                    let maxBid = await bidModel.find({auctionId:auctionId,autoBidAmount:{$gte:0.01}}).sort({autoBidTime:1});
                    if(maxBid.length > 0){
                        await setAutoBid(item, maxBid, bidCount, auctionDataBidderIndex,1);
                    }else{
                        console.log(`no max bid found for id ${auctionId}`)
                    }
                })
            );
            
        }
    })
}, 1000)