"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const default_1 = __importDefault(require("./config/default"));
const logger_1 = __importDefault(require("./logger"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
const connect_1 = __importDefault(require("./database/connect"));
const web_1 = __importDefault(require("./routes/web"));
const deserializeUser_1 = __importDefault(require("./middlewares/deserializeUser"));
const port = default_1.default.port;
const host = default_1.default.host;
const appConfig_1 = __importDefault(require("./appConfig"));
const serverConfig_1 = __importDefault(require("./serverConfig"));
appConfig_1.default.use(express_1.default.json());
appConfig_1.default.use(express_1.default.urlencoded({ extended: false }));
appConfig_1.default.use(deserializeUser_1.default);
appConfig_1.default.use(express_1.default.static(__dirname + '/public'));
const socket_1 = __importDefault(require("./socket"));
appConfig_1.default.use((0, express_session_1.default)({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
appConfig_1.default.use((0, express_flash_1.default)());
appConfig_1.default.set('views', path_1.default.join(__dirname, '/views'));
appConfig_1.default.set('view engine', 'ejs');
const private_socket_1 = __importDefault(require("./socket/private.socket"));
(0, private_socket_1.default)(socket_1.default);
serverConfig_1.default.listen(port, () => {
    logger_1.default.info(`server started at ${host}:${port}/register`);
    (0, connect_1.default)();
    (0, web_1.default)(appConfig_1.default);
});
