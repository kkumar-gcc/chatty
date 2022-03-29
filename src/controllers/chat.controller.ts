import { Request, Response,NextFunction } from 'express';
import log from '../logger';
const io = require("../socket");
import User from '../models/user.model';
export async function getChatHandler(req: Request, res: Response) {
    var users = await User.find() as any;
    return res.render("privatechat.ejs",{users:users,user:req.session.user});
}
export async function getRoomHandler(req: Request, res: Response) {
    var users = await User.find() as any;

    // const params = req.params.id.split('-');

    // const receiverId = params[0];
    // var receiver = User.find({ "_id": Object(receiverId)}) as any;
    // log.info(receiver.name);

    return res.render("privatechat.ejs",{users:users,user:req.session.user});
}