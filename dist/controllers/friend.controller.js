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
exports.friendReqActionHandler = exports.userFriendHandler = exports.userFriendRequestsHandler = exports.getChatFriendHandler = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const async_1 = __importDefault(require("async"));
const mongoose_1 = __importDefault(require("mongoose"));
function getChatFriendHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        async_1.default.parallel([
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
            const friends = results[0];
            return res.render("chat.ejs", { user, friends });
        });
    });
}
exports.getChatFriendHandler = getChatFriendHandler;
function userFriendRequestsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        async_1.default.parallel([
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
            const friends = results[0];
            return res.render("request.ejs", { user, friends });
        });
        // return res.redirect('/home');
    });
}
exports.userFriendRequestsHandler = userFriendRequestsHandler;
function userFriendHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        // const updateUserA = await User.findOneAndUpdate(
        //     { _id: Object(user._id), "friends.user": Object(req.body.recipientId) },
        //     { $set: { friends: { user: Object(req.body.recipientId), status: 2 } } },
        // )
        // const updateUserB = await User.findOneAndUpdate(
        //     { _id: Object(req.body.recipientId), "friends.user": Object(user._id) },
        //     { $set: { friends: { user: Object(user._id), status: 2 } } },
        // )
        const friendExist = yield user_model_1.default.findOne({ _id: Object(user._id), "friends.user": Object(req.body.recipientId) });
        if (friendExist) {
            return res.redirect('/home');
        }
        const updateUserA = yield user_model_1.default.findOneAndUpdate({ _id: Object(user._id) }, { $push: { friends: { user: Object(req.body.recipientId), status: 1 } } }, { upsert: true });
        const updateUserB = yield user_model_1.default.findOneAndUpdate({ _id: Object(req.body.recipientId) }, { $push: { friends: { user: Object(user._id), status: 2 } } }, { upsert: true });
        return res.redirect('/home');
    });
}
exports.userFriendHandler = userFriendHandler;
function friendReqActionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        if (req.body.action === "Accept") {
            const updateUserA = yield user_model_1.default.updateOne({ _id: Object(user._id), "friends.user": Object(req.body.recipientId) }, { $set: { "friends.$.user": Object(req.body.recipientId), "friends.$.status": 3 } });
            const updateUserB = yield user_model_1.default.updateOne({ _id: Object(req.body.recipientId), "friends.user": Object(user._id) }, { $set: { "friends.$.user": Object(user._id), "friends.$.status": 3 } });
        }
        else if (req.body.action === "Decline") {
            const updateUserA = yield user_model_1.default.updateOne({ _id: Object(user._id), "friends.user": Object(req.body.recipientId) }, { $set: { "friends.$.user": Object(req.body.recipientId), "friends.$.status": 4 } });
            // { $set: { "friends.$.user":Object(req.body.recipientId) ,status: 4 } } }
            const updateUserB = yield user_model_1.default.updateOne({ _id: Object(req.body.recipientId), "friends.user": Object(user._id) }, { $set: { "friends.$.user": Object(user._id), "friends.$.status": 4 } });
        }
        return res.redirect('/home');
    });
}
exports.friendReqActionHandler = friendReqActionHandler;
