import express, { Application, Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
import config from "./config/default";
import log from './logger';
var path = require('path');
import session from "express-session";
// import passport from 'passport';
import { Server } from 'socket.io';
import flash from 'express-flash';
import connect from './database/connect';
import routes from './routes/web';
import deserializeUser from './middlewares/deserializeUser';
const port = config.port as Number;
const host = config.host as string;
const app = require('./appConfig') ;
const server = require('./serverConfig');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use(express.static(__dirname + '/public'));

const io = require("./socket");

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');

require("./socket/private.socket")(io);
app.get("/reg",(req:Request,res:Response)=>{
    res.render("register2.ejs")
})
server.listen(port, () =>{
    log.info(`server started at http://${host}:${port}`);
    connect();
    routes(app);
});
