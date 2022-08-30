"use strict";
const https = require("https");
const fs = require("fs");
const bidList = require('./server/controller/bid/autoBidController').exec;
const auctionList = require('./server/controller/auction/autoAuctionController').exec;
const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./server/database/connection');

const app = express();

const PORT = process.env.PORT || 9090
// const PORT = process.env.PORT || 8443

// log requests
app.use(morgan('tiny'));

//helmet and cors
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
app.use(cors());

// mongodb connection
connectDB();

// support parsing of application/json type post data
app.use(bodyparser.json());
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

// load routers
app.use('/', require('./server/routes/router'));


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
// https.createServer(options, app).listen(PORT, ()=> { console.log(`Server is running on ${Date.now()}`)});