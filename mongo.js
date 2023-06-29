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
exports.connectToMongoDB = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 0 },
});
exports.User = mongoose_1.default.model("User", userSchema);
const connectToMongoDB = (connString) => __awaiter(void 0, void 0, void 0, function* () {
    if (connString) {
        try {
            yield mongoose_1.default.connect(connString);
            console.log("Successfully Connected to MongoDB");
        }
        catch (error) {
            console.log(`Internal Server Error While Connection to MongoDB: ${error}`);
            process.exit(1);
        }
    }
    else {
        console.log("MongoDB Connection String Not Fond");
        process.exit(1);
    }
});
exports.connectToMongoDB = connectToMongoDB;
