"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomHandler = exports.getChatHandler = void 0;
const async_1 = __importDefault(require("async"));
const moment_1 = __importDefault(require("moment"));
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function getChatHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_model_1.default.find();
        return res.render("privatechat.ejs", { users, user: req.session.user });
    });
}
exports.getChatHandler = getChatHandler;
function getRoomHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // var users = await User.find() as any;
        const user = req.session.user;
        const params = req.params.id.split('-');
        const receiverId = params[0];
        const receiver = yield user_model_1.default.findOne({ _id: Object(receiverId) });
        async_1.default.parallel([
            (callback) => {
                const result = message_model_1.default.aggregate([
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
                                                { $substr: ["$sender", 0, 1] }
                                            ]
                                        },
                                        { $concat: ["$sender", "and", "$receiver"] },
                                        { $concat: ["$receiver", "and", "$sender"] },
                                    ]
                                }
                            }, "body": { $first: "$$ROOT" }
                        }
                    }
                ], (err, newResult) => {
                    callback(err, newResult);
                });
            },
            (callback) => {
                message_model_1.default.find({
                    "$or": [
                        { "$and": [{ "receiver": Object(receiverId) }, { "sender": Object(user._id) }] },
                        { "$and": [{ "receiver": Object(user._id) }, { "sender": Object(receiverId) }] }
                    ]
                })
                    .populate('sender', ["-password", "-friends"])
                    .populate('receiver', ["-password", "-friends"])
                    .exec((err, result3) => {
                    callback(err, result3);
                });
            },
            (callback) => __awaiter(this, void 0, void 0, function* () {
                yield user_model_1.default.aggregate([
                    {
                        "$match": { _id: new mongoose_1.default.Types.ObjectId(user._id) }
                    },
                    {
                        "$unwind": "$friends"
                    },
                    {
                        "$lookup": {
                            "from": user_model_1.default.collection.name,
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
                            "_id": "$friends.user",
                            "username": "$friendUser.username",
                            "email": "$friendUser.email",
                            "name": "$friendUser.name",
                            "profileNum": "$friendUser.profileNum",
                            "status": "$friends.status",
                            "description": "$friendUser.description"
                        }
                    }
                ], (err, newResult) => {
                    callback(err, newResult);
                });
            })
        ], (err, results) => {
            const result = results[1];
            const result2 = results[2];
            return res.render("privatechat.ejs", { user, friends: result2, chats: result, moment: moment_1.default, receiver });
        });
    });
}
exports.getRoomHandler = getRoomHandler;
