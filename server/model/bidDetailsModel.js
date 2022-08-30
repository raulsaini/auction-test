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
    totalAutoBidAmount: {
        type: Number,
        default: 0
    },  
    date: {
        type: Date,
        default: () => new Date()
    }

})

const bidDetailModel = mongoose.model('bidDetail', schema);

module.exports = bidDetailModel;