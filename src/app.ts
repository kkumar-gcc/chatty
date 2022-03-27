import express, { Application, Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
import config from "./config/default";
import log from './logger';
var path = require('path');
import session from "express-session";
import passport from 'passport';
import flash from 'express-flash';
import connect from './database/connect';
import routes from './routes/web';
import deserializeUser from './middlewares/deserializeUser';
const port = config.port as Number;
const host = config.host as string;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use(express.static(__dirname + '/public'));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
// app.use(function(req, res, next){
//     res.locals.errors = req.flash("errors");
//     res.locals.success = req.flash("success");
//     next();
// });

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');

app.listen(port, () => {
    log.info(`server started at http://${host}:${port}`);
    connect();
    routes(app);
});
