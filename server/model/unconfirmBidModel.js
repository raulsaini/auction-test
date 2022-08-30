"use strict";
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    
    auctionId: {
        type: String,
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
    txHash: {
        type: String,
        default: null,
        unique:true
    },
    amount: {
        type: Number,
    },
    maxBid: {
        type: Number,
        default:0
    },
    paymentStatus: {
        type: Boolean,
        default:false
    },
    date: {
        type: Date,
        default: () => new Date()
    }

})

const unconfirmBidModel = mongoose.model('unconfirmBid', schema);

module.exports = unconfirmBidModel;