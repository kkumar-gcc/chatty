"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb://localhost:27017/chattyDB");
const app = (0, express_1.default)();
const fruitSchema = new mongoose_1.default.Schema({
    name: String,
    rating: Number,
});
const Fruit = mongoose_1.default.model("Fruit", fruitSchema);
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(3000, () => console.log("server started at port 3000"));
