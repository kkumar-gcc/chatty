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
exports.getsearchResultHandler = exports.searchResultHandler = exports.searchUserResultHandler = void 0;
const logger_1 = __importDefault(require("../logger"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function searchUserResultHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUsername = req.query.query;
        const searchUser = req.session.user;
        const results = [];
        try {
            const users = yield user_model_1.default.find({ "$and": [{ _id: { $ne: searchUser._id } }, { "username": { $regex: searchUsername, $options: 'i' } }] }).limit(10);
            users.forEach((user) => {
                const { _id, username, name, profileNum } = user;
                results.push({ _id, username, name, profileNum });
            });
        }
        catch (err) {
            logger_1.default.info(err);
        }
        res.send(JSON.stringify(results));
    });
}
exports.searchUserResultHandler = searchUserResultHandler;
function searchResultHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        return res.render("search.ejs", { user });
    });
}
exports.searchResultHandler = searchResultHandler;
function getsearchResultHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.query;
        const user = req.session.user;
        const receiverId = req.body.receiverId;
        if (username && (user.username !== username)) {
            const friends = yield user_model_1.default.aggregate([
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
            ]);
            // find({"$text":{"$search":"\"Craig\" \"Dr. Bob\""}})
            const friendSearch = yield user_model_1.default.aggregate([
                {
                    "$match": { "username": { $regex: username, $options: 'i' } }
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
            ]);
            const searchUsers = yield user_model_1.default.find({ "username": username });
            const friend = friendSearch.find((item) => {
                return item._id.toString() === receiverId;
            });
            return res.render("search.ejs", { user, userStatus: friend, searchUsers, searchWord: username });
        }
        else {
            return res.redirect('back');
        }
    });
}
exports.getsearchResultHandler = getsearchResultHandler;
