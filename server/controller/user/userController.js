"use strict";
var userModel = require('../../model/userModel');
const Validator = require('../validationController');

exports.addUser = async(req, res) =>  {
    try{
        let data = Validator.checkValidation(req.body);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        userModel.find({address:data.address}).countDocuments().then((num)=>{
            if(num == 0){
                let address = (data.address).toUpperCase();
                const newData = new userModel({
                    address: address,
                    balance: data.bal
                })
        
                // save user in the database
                newData.save(newData).then(data => {
                    res.status(200).send({ success: true, msg: "User registered successfully", data: '', errors: '' });
                }).catch(err => {
                    console.log(err)
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating a create operation"
                    });
                });
            }else{
                res.status(200).send({ success: true, msg: "Address already registered", data: '', errors: '' });
            }
        })
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
    
}

exports.removeUser = async(req, res) =>  {
    try{
        let data = Validator.checkValidation(req.query);
        if (data['success'] === true) {
            data = data['data'];
        } else {
            res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        userModel.find({_id:data.id}).then((data)=>{
            if(data){
                userModel.findOneAndDelete({_id:item._id}).then((data)=>{
                    res.status(200).send({ success: true, msg: "User removed from vip", data: {}, error: '' });
                })
            }else{
                res.status(202).send({ success: false, msg: "User not found", data: {}, error: '' });
            }
        })
        
    }catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
    
}


exports.checkUser = async(req,res) => {
    let data = Validator.checkValidation(req.query);
    if (data['success'] === true) {
        data = data['data'];
    } else {
        res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
    }
    let address = (data.address).toUpperCase();
    console.log(address,'addddd')
    userModel.find({address:address}).countDocuments().then((data)=>{
        if(data == 1){
            res.status(200).send({ success: true, msg: "User found", data: {}, error: '' });  
        }else{
            res.status(202).send({ success: false, msg: "User not found", data: {}, error: '' });
        }
    })
}
