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
const user_controller_1 = require("../controllers/user.controller");
const session_controller_1 = require("../controllers/session.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const user_schema_1 = require("../schema/user.schema");
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const jwt_utils_1 = require("../utils/jwt.utils");
const logger_1 = __importDefault(require("../logger"));
const isLogin_1 = __importDefault(require("../middlewares/isLogin"));
const loggedIn_1 = __importDefault(require("../middlewares/loggedIn"));
const chat_controller_1 = require("../controllers/chat.controller");
const home_controller_1 = require("../controllers/home.controller");
const message_controller_1 = require("../controllers/message.controller");
const search_controller_1 = require("../controllers/search.controller");
const friend_controller_1 = require("../controllers/friend.controller");
const isFriend_1 = __importDefault(require("../middlewares/isFriend"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
const isToken_1 = __importDefault(require("../middlewares/isToken"));
const notification_controller_1 = require("../controllers/notification.controller");
function default_1(app) {
    app.get("/register", loggedIn_1.default, (req, res) => {
        res.render("register.ejs");
    });
    app.post("/register", loggedIn_1.default, (0, validateRequest_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    app.get("/login", loggedIn_1.default, (req, res) => {
        res.render("login.ejs");
    });
    // app.get("/chat",isLogin,getChatHandler);
    app.post("/login", loggedIn_1.default, (0, validateRequest_1.default)(user_schema_1.createUserSessionSchema), session_controller_1.createUserSessionHandler);
    app.get("/logout", isLogin_1.default, session_controller_1.deleteUserSessionsHandler);
    app.get("/home", isLogin_1.default, home_controller_1.getHomeHandler);
    app.get("/chat", isLogin_1.default, friend_controller_1.getChatFriendHandler);
    app.get("/chat/:id", isLogin_1.default, isFriend_1.default, chat_controller_1.getRoomHandler);
    app.post("/chat/:id", isLogin_1.default, isFriend_1.default, message_controller_1.postMessageHandler);
    app.get("/search", isLogin_1.default, search_controller_1.searchResultHandler);
    app.get("/searchUser", isLogin_1.default, search_controller_1.searchUserResultHandler);
    app.post("/search", isLogin_1.default, search_controller_1.getsearchResultHandler);
    app.post("/user/request", isLogin_1.default, friend_controller_1.userFriendHandler);
    app.post("/user/requestAccept", isLogin_1.default, friend_controller_1.friendReqActionHandler);
    app.post("/profile/update", isLogin_1.default, user_controller_1.getUserHandler);
    app.get("/passwordReset", loggedIn_1.default, auth_controller_1.resetPasswordRequestHandler);
    app.post("/passwordReset", loggedIn_1.default, auth_controller_1.resetPasswordResponseHandler);
    app.get("/passwordReset/:token", loggedIn_1.default, isToken_1.default, auth_controller_1.newPasswordRequestHandler);
    app.post("/passwordReset/:token", loggedIn_1.default, isToken_1.default, auth_controller_1.newPasswordResponseHandler);
    app.get("/chatrequests", isLogin_1.default, friend_controller_1.userFriendRequestsHandler);
    app.put("/user-detail", isLogin_1.default, user_controller_1.getUserDetailHandler);
    app.get("/notifications", isLogin_1.default, notification_controller_1.getNotificationHandler);
    /// testing routes /profile/update
    app.get("/verify", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const jwtToken = (0, jwt_utils_1.signJwt)({
            username: "krishan"
        });
        logger_1.default.info(jwtToken);
        const { decoded, expired, valid } = yield (0, jwt_utils_1.verifyJwt)(jwtToken);
        logger_1.default.info(decoded);
    }));
    app.get("/new", (req, res) => {
        res.render("index.ejs");
    });
    app.get("/api/sessions", requireUser_1.default, session_controller_1.getUserSessionsHandler);
    //
}
exports.default = default_1;
