"use strict";
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    type:{
        type: String,
        required: true,
    },
    tokens:{
        type: Number,
    },
    tokenId:{
        type: Number,
    },
    contractAddress: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    bidCount: {
        type: Number,
        default: 0
    },
    lastBidder: {
        type: String,
        default: 0
    },
    runningStatus: {
        type: Boolean,
        required: true
    },
    item: {
        type: String,
        required: true,
    },
    paymentHash: {
        type: String,
    },
    paymentStatus: {
        type: Boolean,
        default: false,
    },
    autoBidderIndex: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: () => new Date()
    }

})

const auctionModel = mongoose.model('auction', schema);

module.exports = auctionModel;