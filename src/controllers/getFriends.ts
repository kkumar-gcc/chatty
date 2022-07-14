import { Request, Response } from "express";
import log from "../logger";
import User from "../models/user.model";
import mongoose from "mongoose";
export async function getFriends(id: string) {

    const friends = await User.aggregate([
        { "$match": { _id: new mongoose.Types.ObjectId(id) } },
        {
            "$lookup": {
                "from": User.collection.name,
                "localField":"friends.user",
                "foreignField": "_id",
                "let": { "friends": "$friends" },
                "pipeline": [

                    {
                        "$project": {
                            "name": 1,
                            "email": 1,
                            'username': 1,
                            'description':1
                        }
                    }
                ],
                "as": "friends"
            }
        }

    ]);
    // log.info(friends);
}