import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import async from 'async';
import Friend from '../models/friend.model';
import mongoose from 'mongoose';
export async function getChatFriendHandler(req: Request, res: Response) {
    const user = req?.session?.user as any;

    async.parallel([
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


            ],(err: any, newResult: any) => {
                callback(err, newResult);
            })
        }
    ], (err: any, results: any) => {
        const friends = results[0];
        return res.render("chat.ejs", { user,friends});
    })
}
export async function userFriendRequestsHandler(req: Request, res: Response) {
    const user = req?.session?.user as any;

    async.parallel([
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


            ], (err: any, newResult: any) => {
                callback(err, newResult);
            })
        }
    ], (err: any, results: any) => {
        const friends = results[0];
        return res.render("request.ejs", { user,friends});
    })
    // return res.redirect('/home');
}


export async function userFriendHandler(req: Request, res: Response) {
    const user = req?.session?.user as any;

    // const updateUserA = await User.findOneAndUpdate(
    //     { _id: Object(user._id), "friends.user": Object(req.body.recipientId) },
    //     { $set: { friends: { user: Object(req.body.recipientId), status: 2 } } },

    // )
    // const updateUserB = await User.findOneAndUpdate(
    //     { _id: Object(req.body.recipientId), "friends.user": Object(user._id) },
    //     { $set: { friends: { user: Object(user._id), status: 2 } } },

    // )
    const friendExist = await User.findOne({ _id: Object(user._id), "friends.user": Object(req.body.recipientId) });
    if (friendExist) {
        return res.redirect('/home');
    }

    const updateUserA = await User.findOneAndUpdate(
        { _id: Object(user._id) },
        { $push: { friends: { user: Object(req.body.recipientId), status: 1 } } },
        { upsert: true }
    )
    const updateUserB = await User.findOneAndUpdate(
        { _id: Object(req.body.recipientId) },
        { $push: { friends: { user: Object(user._id), status: 2 } } },
        { upsert: true }
    );
    return res.redirect('/home');
}

export async function friendReqActionHandler(req: Request, res: Response) {
    const user = req?.session?.user as any;

    if (req.body.action === "Accept") {
        const updateUserA = await User.updateOne(
            { _id: Object(user._id), "friends.user": Object(req.body.recipientId) },
            { $set: { "friends.$.user":Object(req.body.recipientId) ,"friends.$.status": 3 } }
        );

        const updateUserB = await User.updateOne(
            { _id: Object(req.body.recipientId), "friends.user": Object(user._id) },
            { $set: { "friends.$.user":Object(user._id) ,"friends.$.status": 3 } }
        );
    }
    else if (req.body.action === "Decline") {

        const updateUserA = await User.updateOne(
            { _id: Object(user._id), "friends.user": Object(req.body.recipientId) },
            { $set: { "friends.$.user":Object(req.body.recipientId) ,"friends.$.status": 4 } }
        )
        // { $set: { "friends.$.user":Object(req.body.recipientId) ,status: 4 } } }
        const updateUserB = await User.updateOne(
            { _id: Object(req.body.recipientId), "friends.user": Object(user._id) },
            { $set: { "friends.$.user":Object(user._id) ,"friends.$.status": 4 } }
        )
    }
    return res.redirect('/home');
}

