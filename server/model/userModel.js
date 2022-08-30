"use strict";
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    
    address: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required:true,
    },
    date: {
        type: Date,
        default: () => new Date()
    }

})

const userModel = mongoose.model('user', schema);

module.exports = userModel;