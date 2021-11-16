"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetails = void 0;
const mongoose_1 = require("mongoose");
;
let UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: String,
    password: { type: String, required: true }
});
const userDetails = (0, mongoose_1.model)('user', UserSchema);
exports.userDetails = userDetails;
