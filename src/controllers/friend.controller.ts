import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import Friend from '../models/friend.model';
export async function userFriendHandler(req: Request, res: Response) {
    const user = req.session.user as any;

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
    const user = req.session.user as any;

    if (req.body.action == "Accept") {
        const updateUserA = await User.updateOne(
            { _id: Object(user._id), "friends.user": Object(req.body.recipientId) },
            { $set: { "friends.$.user":Object(req.body.recipientId) ,"friends.$.status": 3 } } 
        );
        
        const updateUserB = await User.updateOne(
            { _id: Object(req.body.recipientId), "friends.user": Object(user._id) },
            { $set: { "friends.$.user":Object(user._id) ,"friends.$.status": 3 } } 
        );
    }
    else if (req.body.action == "Decline") {

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

