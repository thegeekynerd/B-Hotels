"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_route_1 = __importDefault(require("./user/user-route"));
const app = (0, express_1.default)();
const mongodb = "mongodb://localhost:27017/bhotels";
mongoose_1.default.connect(mongodb);
const db = mongoose_1.default.connection;
db.once('open', () => console.log("Connection made to DB"));
db.on('error', (error) => console.log(error));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/user', user_route_1.default);
app.get('/', (req, res) => {
    res.send("Hello");
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
