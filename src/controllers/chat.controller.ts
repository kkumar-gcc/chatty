import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import async from 'async';
import moment from 'moment';
import User from '../models/user.model';
import Message from '../models/message.model';
import mongoose from 'mongoose';
export async function getChatHandler(req: Request, res: Response) {
    const users = await User.find() as any;
    return res.render("privatechat.ejs", { users, user: req.session.user });
}
export async function getRoomHandler(req: Request, res: Response) {
    // var users = await User.find() as any;

    const user = req.session.user as any;

    const params = req.params.id.split('-');

    const receiverId = params[0];

    const receiver = await User.findOne({_id:Object(receiverId)}) as any;

    async.parallel([
         (callback) => {
            const result = Message.aggregate([
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
                }],(err: any, newResult: any) => {
                    callback(err, newResult);

                });
        },
       (callback) => {
            Message.find({
                "$or": [
                    { "$and": [{ "receiver": Object(receiverId) }, { "sender": Object(user._id) }] },
                    { "$and": [{ "receiver": Object(user._id) }, { "sender": Object(receiverId) }] }
                ]
            })
                .populate('sender', ["-password","-friends"])
                .populate('receiver',["-password","-friends"])
                .exec((err, result3) => {
                    callback(err, result3);
                })
        },
        async (callback: any) => {
            await User.aggregate([
                {
                    "$match": { _id: new mongoose.Types.ObjectId(user._id)}
                },
                {
                    "$unwind": "$friends"
                },
                {
                    "$lookup": {
                        "from": User.collection.name,
                        "localField": "friends.user",
                        "foreignField": "_id",
                        "as": "friendUser"
                    }
                },
                {
                    "$unwind": "$friendUser"
                },
                {
                    "$project": {
                        "_id":  "$friends.user",
                        "username": "$friendUser.username",
                        "email": "$friendUser.email",
                        "name":"$friendUser.name",
                        "profileNum":"$friendUser.profileNum",
                        "status": "$friends.status",
                        "description":"$friendUser.description"
                    }
                }
            ],(err: any, newResult: any) =>{
                callback(err, newResult);
            })
        }
    ], (err: any, results: any) => {
        const result = results[1];
        const result2 = results[2];
        return res.render("privatechat.ejs", { user,friends:result2, chats: result, moment, receiver });
    })
}