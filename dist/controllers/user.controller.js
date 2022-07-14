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
exports.getUserDetailHandler = exports.getUserHandler = exports.createUserHandler = void 0;
const user_service_1 = require("../services/user.service");
const logger_1 = __importDefault(require("../logger"));
const ejs_1 = __importDefault(require("ejs"));
const user_model_1 = __importDefault(require("../models/user.model"));
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const olduser = yield user_model_1.default.find({ "$or": [{ "email": req.body.email }, { "username": { $regex: req.body.username, $options: 'i' } }] });
        if (olduser && olduser.length > 0) {
            req.flash("uniError", "username or email already exits");
            return res.redirect("back");
        }
        try {
            const user = yield (0, user_service_1.createUser)(req.body);
            return res.render("login.ejs", { success: "account successfully created" });
        }
        catch (e) {
            if (e.name === "ValidationError") {
                const errors = {};
                e.inner.forEach((x) => {
                    if (x.path !== undefined) {
                        const z = (x.path).slice(5);
                        errors[z] = x.errors;
                    }
                });
                return res.redirect("/register");
            }
            return res.status(500).send("Something went wrong");
            ;
        }
    });
}
exports.createUserHandler = createUserHandler;
function getUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        user_model_1.default.findOneAndUpdate({ _id: user._id }, { name: req.body.name, description: req.body.description }, { new: true }, (err, doc) => {
            return res.redirect("/home");
        });
    });
}
exports.getUserHandler = getUserHandler;
function getUserDetailHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.userId;
        const user = yield user_model_1.default.find({ "_id": id }).select(["-password", "-friends"]).exec();
        yield ejs_1.default.renderFile(__dirname + "/../views/popover.ejs", { user: user[0] }, (err, data) => {
            if (err) {
                logger_1.default.error(err);
            }
            return res.json(data);
        });
    });
}
exports.getUserDetailHandler = getUserDetailHandler;
