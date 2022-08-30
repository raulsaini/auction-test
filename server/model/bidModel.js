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
    autoBidAmount: {
        type: Number,
        default: 0
    },
    totalAutoBidAmount: {
        type: Number,
        default: 0
    },
    autoBidTime: {
        type: Number,
        default: 0
    },
    bidCount: {
        type: Number,
        required:true
    },
    totalBids: {
        type: Number,
        default:1
    },
    autoBidRefund: {
        type: String,
        default:"unpaid"
    },
    date: {
        type: Date,
        default: () => new Date()
    }

})

const bidModel = mongoose.model('bid', schema);

module.exports = bidModel;