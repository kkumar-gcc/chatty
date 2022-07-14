import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import async from 'async';
import User from '../models/user.model';
import { createMessage } from '../services/message.service';
import { nextTick } from 'process';
import { omit } from 'lodash';
// export async function getChatHandler(req: Request, res: Response) {
//     var users = await User.find() as any;
//     return res.render("privatechat.ejs",{users:users,user:req.session.user});
// }
export async function postMessageHandler(req: Request, res: Response, next: NextFunction) {

    const user = req.session.user as any;

    const params = req.params.id.split('-');

    const receiverId = params[0];

    async.waterfall([
        (callback: any) => {
            if (req.body.message) {
                const receiver = User.findOne({ "_id": Object(receiverId) }, (err: any, data: any) => {
                    callback(err, omit(data.toJSON(), "password"));
                });
            }
        },
        async (data: any, callback: any) => {
            if (req.body.message) {
                const message = await createMessage(req.body.message, data._id, user._id)
                callback(message);
            }
        }
    ], (err, result) => {
        res.redirect("/chat/" + req.params.id);
    });
}