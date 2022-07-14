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
exports.deleteUserSessionsHandler = exports.getUserSessionsHandler = exports.createUserSessionHandler = void 0;
const user_service_1 = require("../services/user.service");
const session_service_1 = require("../services/session.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const default_1 = __importDefault(require("../config/default"));
const session_model_1 = __importDefault(require("../models/session.model"));
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_service_1.validatePassword)(req.body);
        if (!user) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        }
        const session = yield (0, session_service_1.createSession)(user._id, req.get("user-agent") || "");
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: default_1.default.accessTokenTtl });
        const { decoded, expired, valid } = yield (0, jwt_utils_1.verifyJwt)(accessToken);
        if (decoded) {
            req.session.user = decoded;
        }
        res.cookie("accessToken", accessToken, {
            maxAge: 30000,
            httpOnly: true,
        });
        const refreshToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: default_1.default.accessTokenTtl });
        return res.redirect("/home");
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
function getUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        const sessions = yield (0, session_service_1.findSessions)({ user: user.id, valid: true });
        return res.send(sessions);
    });
}
exports.getUserSessionsHandler = getUserSessionsHandler;
function deleteUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        if (req.session) {
            yield session_model_1.default.deleteMany({ "user": Object(user._id) });
            req.session.destroy(err => {
                if (err) {
                    res.status(400).send('Unable to log out');
                }
                else {
                    return res.redirect("/login");
                }
            });
        }
        else {
            res.end();
        }
    });
}
exports.deleteUserSessionsHandler = deleteUserSessionsHandler;
