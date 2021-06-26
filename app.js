require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 2020;
require("./dbConnect")();


// set plugin
const session = require('express-session');
app.use(session({
    secret: process.env.KUNCI_SESI,
    key: 'sesi_tma',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, sameSite: true }
}));
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./configuration/CorsConfigs")
app.use(cors(corsOptions));
app.use(helmet());
app.use(helmet.hidePoweredBy({setTo:"PHP 7.2.0"}));
const toBusy = require("toobusy-js");
app.use((req, res, next) => {
    if (toBusy()) {
        res.status(429).json({
            message: `Sorry, the server is busy`,
            status: 429
        });
    } else {
        next();
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// set plugin

// SECURITY
const csruf=require("csurf");
const cookieParser=require("cookie-parser");
const csrf=csruf({cookie:true});
app.use(cookieParser());
app.use(csrf);
// SECURITY

// model
require("./models");
// model

// router
app.use(require("./router/index"));
app.use(require("./middleware/errHandler"))
// router

// require("./wawan");

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is Running ${PORT}`);
});