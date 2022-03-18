import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import config from '../config/default';
import log from './logger';
import connect from './database/connect';
import routes from './routes/web';
const port = config.port as Number;
const host = config.host as string;


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const fruitSchema=new mongoose.Schema({
//     name:String,
//     rating:Number,
// });

// const Fruit=mongoose.model("Fruit",fruitSchema);

app.get("/", (req: Request, res: Response) => {
    res.send("hello world 5");
})


app.listen(port, () => {
    log.info(`server started at http://${host}:${port}`);
    connect();
    routes(app);
});
