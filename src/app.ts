import express, { Application, Request, Response, NextFunction } from 'express';
import config from "./config/default";
import log from './logger';
import path from "path";
import session from "express-session";
import flash from 'express-flash';
import connect from './database/connect';
import routes from './routes/web';
import deserializeUser from './middlewares/deserializeUser';
const port = config.port;
const host = config.host as string;
import app from "./appConfig";
import server from './serverConfig';
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser);
app.use(express.static(__dirname + '/public'));
import io from "./socket";

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');


import privateSocket from './socket/private.socket';
privateSocket(io);

server.listen(port, () =>{
    log.info(`server started at ${host}:${port}/register`);
    connect();
    routes(app);
});
