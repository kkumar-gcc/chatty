import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import async from 'async';
import moment from 'moment';
import User from '../models/user.model';
import Message from '../models/message.model';
export async function getChatHandler(req: Request, res: Response) {
    var users = await User.find() as any;
    return res.render("privatechat.ejs", { users: users, user: req.session.user });
}
export async function getRoomHandler(req: Request, res: Response) {
    var users = await User.find() as any;

    const user = req.session.user as any;

    const params = req.params.id.split('-');

    const receiverId = params[0];
    
    const receiver = await User.findOne({_id:Object(receiverId)}) as any;

    async.parallel([
        function (callback) {
            var result = Message.aggregate([
                { "$match": { "$or": [{ "receiver": Object(user._id) }, { "sender": Object(user._id) }] } },
                { "$sort": { "createdAt": -1 } },
                {
                    "$group": {
                        "_id": {
                            "last_message_between": {
                                "$cond": [
                                    {
                                        "$gt": [
                                            { $substr: ["$receiver", 0, 1] },
                                            { $substr: ["$sender", 0, 1] }]
                                    },
                                    { $concat: ["$sender", "and", "$receiver"] },
                                    { $concat: ["$receiver", "and", "$sender"] },
                                ]
                            }
                        }, "body": { $first: "$$ROOT" }
                    }
                }], function (err: any, newResult: any) {
                    callback(err, newResult);

                });
        },
        function (callback) {
            Message.find({
                "$or": [
                    { "$and": [{ "receiver": Object(receiverId) }, { "sender": Object(user._id) }] },
                    { "$and": [{ "receiver": Object(user._id) }, { "sender": Object(receiverId) }] }
                ]
            })
                .populate('sender', "-password")
                .populate('receiver', "-password")
                .exec((err, result3) => {
                    callback(err, result3);
                })
        }
    ], (err: any, results: any) => {
        const result = results[1];
        // log.info(result);
        return res.render("privatechat.ejs", { users: users, user: req.session.user, chats: result, moment: moment, receiver: receiver });
    })
}