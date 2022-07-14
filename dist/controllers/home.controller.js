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
exports.getHomeHandler = void 0;
const async_1 = __importDefault(require("async"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function getHomeHandler(req, res) {
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
            return res.render("home.ejs", { user, friends });
        });
    });
}
exports.getHomeHandler = getHomeHandler;
// { "$match": { _id: new mongoose.Types.ObjectId(user._id) } },
// {
//     "$lookup": {
//         "from": User.collection.name,
//         "localField": "friends.user",
//         "foreignField": "_id",
//         "let": { "friends": "$friends" },
//         "pipeline": [
//             // { "$unwind": "$friends" },
//             {
//                 "$project": {
//                     "_id": 1,
//                     "name": 1,
//                     "email": 1,
//                     'username': 1,
//                     'profileNum': 1,
//                     'status': "$friends.status",
//                 },
//             },
//             {"$addFields":{
//             }}
//         ],
//         "as": "friends"
//     },
// },
