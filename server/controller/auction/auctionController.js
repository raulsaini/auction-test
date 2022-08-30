const HDWallet = require("ethereum-hdwallet");
const { generateMnemonic, EthHdWallet } = require("eth-hd-wallet");
const auctionModel = require("../../model/auctionModel");
const bidModel = require("../../model/bidModel");
const unconfirmBidModel = require("../../model/unconfirmBidModel");
const Validator = require("../validationController");
const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3("https://ropsten.infura.io/v3/526047abd7564a5baff8fb902643a160")
const account = web3.eth.accounts.wallet.add(process.env.address_key);
let add = account.address;
const Key = process.env.Key;

const token_abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const nft_abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getbaseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "tokenOwner",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function sendToken(token_contract_address, recAddress, amount) {
  return new Promise(async (resolve, reject) => {
    const token_contract = new web3.eth.Contract(
      token_abi,
      token_contract_address
    );
    recAddress = await web3.utils.toChecksumAddress(recAddress);
    let decimals = await token_contract.methods.decimals().call();
    let gaslimit = await token_contract.methods
      .transfer(recAddress, `${amount * 10 ** Number(decimals)}`)
      .estimateGas({ from: add });
    await token_contract.methods
      .transfer(recAddress, `${amount * 10 ** Number(decimals)}`)
      .send({ from: add, gas: gaslimit })
      .on("receipt", (receipt) => {
        if (receipt.status == true) {
          const tx = receipt.transactionHash;
          resolve(true);
        } else {
          resolve(false);
          // sendToken(token_contract_address, recAddress, amount)
        }
      })
      .on("error", (error) => {
        console.log(error);
        resolve(false);
        // sendToken(token_contract_address, recAddress, amount)
      });
  });
}

async function sentNFT(nft_contract_address, recAddress, tokenid) {
  return new Promise(async (resolve, reject) => {
    const nft_contract = new web3.eth.Contract(nft_abi, nft_contract_address);
    recAddress = await web3.utils.toChecksumAddress(recAddress);
    let gaslimit = await nft_contract.methods
      .transferFrom(add, recAddress, tokenid)
      .estimateGas({ from: add });
    console.log(add, recAddress, tokenid);
    await nft_contract.methods
      .transferFrom(add, recAddress, tokenid)
      .send({ from: add, gas: gaslimit })
      .on("receipt", (receipt) => {
        if (receipt.status == true) {
          const tx = receipt.transactionHash;
          resolve(true);
        } else {
          resolve(false);
          // sendToken(token_contract_address, recAddress, amount)
        }
      })
      .on("error", (error) => {
        console.log(error);
        resolve(false);
        // sendToken(token_contract_address, recAddress, amount)
      });
  });
}

exports.createAuction = async(req, res) => {
  try {
    let data = Validator.checkValidation(req.body);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      res
        .status(201)
        .send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    if (data.category == "nft") {
      auctionModel
        .find({
          contractAddress: data.contract,
          item: data.item.toString(),
          runningStatus: true,
        })
        .countDocuments()
        .then((num) => {
          if (num > 0) {
            res
              .status(201)
              .send({
                success: true,
                msg: "Nft already on auction",
                data: "",
                errors: "",
              });
          }
        });
    }
    const auctiocount = await auctionModel.find().countDocuments();
    const wallet = EthHdWallet.fromMnemonic(Key);
    let admin = wallet.generateAddresses(auctiocount+1);
    admin = admin[auctiocount];
    let privateKey = wallet.getPrivateKey(admin);
    privateKey = privateKey.toString("hex");
    console.log("enteerrrr", data);
    const newData = new auctionModel({
      wallet: admin,
      privateKey: privateKey,
      contractAddress: data.contract,
      startTime: data.starttime,
      endTime: data.endtime,
      runningStatus: true,
      item: data.item,
      type: data.type,
      amount: data.amount,
      tokens: data.tokens,
      tokenId: data.tokenid,
    });

    // save user in the database
    newData
      .save(newData)
      .then((data) => {
        res
          .status(200)
          .send({
            success: true,
            msg: "User registered successfully",
            data: "",
            errors: "",
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
        });
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.getRunningAuction = (req, res) => {
  try {
    auctionModel.find({ runningStatus: true }).then((data) => {
      if (data.length > 0) {
        res
          .status(200)
          .send({ success: true, msg: "Data found", data: data, errors: "" });
      } else {
        res
          .status(201)
          .send({ success: false, msg: "No data found", data: [], errors: "" });
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.getAllAuction = (req, res) => {
  try {
    auctionModel.find().then((data) => {
      if (data.length > 0) {
        res
          .status(200)
          .send({ success: true, msg: "Data found", data: data, errors: "" });
      } else {
        res
          .status(201)
          .send({ success: false, msg: "No data found", data: [], errors: "" });
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.getOneAuction = (req, res) => {
  try {
    let data = Validator.checkValidation(req.query);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      res
        .status(201)
        .send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    auctionModel.find({ _id: data.id }).then((auction) => {
      if (auction.length > 0) {
        res
          .status(200)
          .send({
            success: true,
            msg: "Data found",
            data: auction,
            errors: "",
          });
      } else {
        res
          .status(201)
          .send({ success: false, msg: "No data found", data: [], errors: "" });
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.fetchUserAuction = (req, res) => {
  try {
    let data = Validator.checkValidation(req.query);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      res
        .status(201)
        .send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    let user = data.address.toUpperCase();
    auctionModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                lastBidder: user,
              },
              {
                runningStatus: false,
              },
              {
                paymentStatus: false,
              },
            ],
          },
        },
      ])
      .then((claimData) => {
        if (claimData.length > 0) {
          res
            .status(200)
            .send({
              success: true,
              msg: "Found data",
              data: claimData,
              errors: "",
            });
        } else {
          res
            .status(201)
            .send({
              success: false,
              msg: "No data Found",
              data: claimData,
              errors: "",
            });
        }
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.transferAuction = async (req, res) => {
  try {
    let data = Validator.checkValidation(req.body);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      res
        .status(201)
        .send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    
    let transfer;
    let auctionData = await auctionModel.find({ _id: data.auctionid });
    const receipt = await web3.eth.getTransaction(data.txhash);
    if(((receipt.to).toUpperCase()) == ((auctionData[0].wallet).toUpperCase()) && (receipt.from.toUpperCase()) == auctionData[0].lastBidder && Number(receipt.value)/10**18 == Number(auctionData[0].bidCount)){
        if (auctionData[0].type == "token") {
            console.log(
              auctionData[0].contractAddress,
              auctionData[0].lastBidder,
              auctionData[0].tokens
            );
            console.log("testing here")
            transfer = await sendToken(
              auctionData[0].contractAddress,
              auctionData[0].lastBidder,
              auctionData[0].tokens
            );
          } else if (auctionData[0].type == "nft") {
            console.log("here");
            transfer = await sentNFT(
              auctionData[0].contractAddress,
              auctionData[0].lastBidder,
              auctionData[0].tokenId
            );
          }
          if (transfer == true) {
            auctionModel
              .findOneAndUpdate(
                { _id: data.auctionid },
                { paymentHash: data.txhash, paymentStatus: true },
                { upsert: true }
              )
              .then((data) => {
                if (data) {
                  res
                    .status(200)
                    .send({
                      success: true,
                      msg: "Transfer successfull",
                      data: "",
                      errors: "",
                    });
                } else {
                  res
                    .status(201)
                    .send({
                      success: false,
                      msg: "Error while transfering",
                      data: "",
                      errors: "",
                    });
                }
              });
          }else{
                res.status(201).send({success: false,msg: "Error while transfering",data: "",errors: "",});
                }
    }else{
        res.status(201).send({success: false,msg: "Invalid details",data: "",errors: "",});
    }   
    
    
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.refundBid = async (req, res) => {
  try {
    let data = Validator.checkValidation(req.query);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      res
        .status(201)
        .send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    let user = data.address.toUpperCase();

    bidModel.aggregate([
        {
          '$match': {
            '$and': [
              {
                'userAddress': user
              }, {
                'autoBidAmount': {
                  '$gt': 0
                }
              }
            ]
          }
        }, {
          '$addFields': {
            'auctionId': {
              '$toObjectId': '$auctionId'
            }
          }
        }, {
          '$lookup': {
            'from': 'auctions', 
            'localField': 'auctionId', 
            'foreignField': '_id', 
            'as': 'auctionData'
          }
        }, {
          '$unwind': {
            'path': '$auctionData'
          }
        }, {
            '$match': {
              'auctionData.runningStatus': false
            }
        },
        {
          '$project': {
            '_id': 1, 
            'auctionId': 1, 
            'autoBidAmount': 1, 
            'name': '$auctionData.item',
            'userAddress':1
          }
        }
      ])
      .then((refundData) => {
        if (refundData.length > 0) {
          res.status(200).send({success: true, msg: "data found",data: refundData,errors: ""});
        } else {
          res.status(203).send({success: false, msg: "no data found",data: "",errors: ""});
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.failedBid = async (req, res) => {
    try {
      let data = Validator.checkValidation(req.query);
      if (data["success"] === true) {
        data = data["data"];
      } else {
        res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: "" });
      }
      let user = data.address.toUpperCase();
  
      unconfirmBidModel.aggregate([
        {
          '$match': {
            '$and': [
              {
                'userAddress': user
              }, {
                'paymentStatus': false
              }
            ]
          }
        }, {
          '$addFields': {
            'auctionId': {
              '$toObjectId': '$auctionId'
            }
          }
        }, {
          '$lookup': {
            'from': 'auctions', 
            'localField': 'auctionId', 
            'foreignField': '_id', 
            'as': 'auctionData'
          }
        }, {
          '$unwind': {
            'path': '$auctionData'
          }
        },{
            '$match': {
              'auctionData.runningStatus': false
            }
        }, {
          '$project': {
            '_id': 1, 
            'auctionId': 1, 
            'amount': 1, 
            'item': '$auctionData.item',
            'userAddress':1
          }
        }
      ])
        .then((refundData) => {
          if (refundData.length > 0) {
            res.status(200).send({success: true, msg: "data found",data: refundData,errors: ""});
          } else {
            res.status(203).send({success: false ,msg: "no data found",data: "",errors: ""});
          }
        });
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
  };

exports.sendFailedRefund = async (req, res) => {
  try {
    let data = Validator.checkValidation(req.body);
    if (data["success"] === true) {
      data = data["data"];
    } else {
      return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: "" });
    }
    let auctionData = await auctionModel.find({ _id: data.auctionid });
    auctionData = auctionData[0];
    const account = web3.eth.accounts.wallet.add(auctionData.privateKey);
    // let add = account.address;
    let wallet = account.address;
    let user = await web3.utils.toChecksumAddress(data.user);
    let gasLimit = await web3.eth.estimateGas({
      from: wallet,
      nonce: `${data.amount * 10 ** 18}`,
      to: user,
    });
    let gasPrice = await web3.eth.getGasPrice();
    const bal = await web3.eth.getBalance(wallet);
    let amount;
    if( Number(bal)/10**18 <= Number(data.amount) ){
        return res.status(203).send({success: false, msg: "Transaction failed ! Please try again later",data: "",errors: ""});
    }else{
        amount = Number(data.amount*10**18)
    }

    await web3.eth
      .sendTransaction({
        from: wallet,
        to: user,
        value: `${amount}`,
        gas: gasLimit,
      })
      .on("transactionHash", function (hash) {
        // ...
      })
      .on("receipt", async function (receipt) {
        if (receipt.status == true) {
          unconfirmBidModel.findOneAndUpdate({ _id: data.id },{ paymentStatus: true },{upsert:true}).then(async (err,update) => {
                if(update){
                    return res.status(200).send({success: true,msg: "Refunded successfully",data: "",errors: ""});
                }else{
                    await unconfirmBidModel.findOneAndUpdate({ _id: data.id },{ paymentStatus: true },{upsert:true})
                    console.log("error while updating in database")
                    return res.status(200).send({success: true,msg: "Refunded successfully",data: "",errors: "",});
                }  
            });
        }else{
            return  res.status(203).send({success: true,msg: "Transaction failed ! Please try again later",data: "",errors: "",});
        }
      })

  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
  }
};

exports.sendAutoBidRefund = async (req, res) => {
    try {
      let data = Validator.checkValidation(req.body);
      if (data["success"] === true) {
        data = data["data"];
      } else {
        return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: "" });
      }
      let auctionData = await auctionModel.find({ _id: data.auctionid });
      auctionData = auctionData[0];
      const account = web3.eth.accounts.wallet.add(auctionData.privateKey);
      let wallet = account.address;
      let user = await web3.utils.toChecksumAddress(data.user);
      let gasLimit = await web3.eth.estimateGas({
        from: wallet,
        nonce: `${data.amount * 10 ** 18}`,
        to: user,
      });
      let gasPrice = await web3.eth.getGasPrice();
      let amount;
        if( Number(bal)/10**18 <= Number(data.amount) ){
            return res.status(203).send({success: false, msg: "Transaction failed ! Please try afain later",data: "",errors: ""});
        }else{
            amount = Number(data.amount*10**18)
        }
      await web3.eth
        .sendTransaction({
          from: wallet,
          to: user,
          value: `${amount}`,
          gas: gasLimit,
        })
        .on("transactionHash", function (hash) {
          // ...
        })
        .on("receipt", async function (receipt) {
          if (receipt.status == true) {
            bidModel.findOneAndUpdate({ _id: data.id },{ autoBidRefund: "paid",autoBidAmount:0 },{upsert:true}).then(async (err, update) => {
                if(update){
                    return res.status(200).send({success: true,msg: "Refunded successfully",data: "",errors: "",});
                }else{
                    await bidModel.findOneAndUpdate({ _id: data.id },{ autoBidRefund: "paid",autoBidAmount:0 },{upsert:true})
                    console.log("error while updating in database")
                    return res.status(200).send({success: true,msg: "Refunded successfully",data: "",errors: "",});
                }
              });
          } else {
           return  res.status(203).send({success: true,msg: "Transaction failed ! Please try again later",data: "",errors: "",});
          }
        })
    } catch (err) {
      console.error(err);
      return res.status(500).send({ success: false, msg: "Error", data: {}, errors: err });
    }
  };