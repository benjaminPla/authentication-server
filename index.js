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
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_slow_down_1 = __importDefault(require("express-slow-down"));
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongo_1 = require("./mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middlewares_1 = require("./middlewares");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
const speedLimiter = (0, express_slow_down_1.default)({
    windowMs: 15 * 60 * 1000,
    delayAfter: 1,
    delayMs: 500,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(limiter);
app.use(speedLimiter);
const connString = process.env.MONGO_URL;
(0, mongo_1.connectToMongoDB)(connString);
app.post("/register", middlewares_1.missingEmailField, middlewares_1.missingPasswordField, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role = 0, } = req.body;
    console.log({ password });
    try {
        const hashPassword = bcrypt_1.default.hashSync(password, 10);
        const newUser = new mongo_1.User({ email, password: hashPassword, role });
        yield newUser.save();
        return res.status(200).json({
            ok: true,
            statusCode: 200,
            message: "User Successfully Created",
            details: newUser,
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            return res.status(409).json({
                ok: false,
                statusCode: 409,
                message: "Email Already Exists",
                details: error,
            });
        }
        return res.status(500).json({
            ok: false,
            statusCode: 500,
            message: "Internal Server Error",
            details: error,
        });
    }
}));
app.post("/login", middlewares_1.missingEmailField, middlewares_1.missingPasswordField, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield mongo_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                ok: false,
                statusCode: 401,
                message: "Authentication Fails",
                details: "",
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (isValidPassword) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, process.env.JWT_TOKEN || "", {
                expiresIn: "1m",
            });
            return res.status(200).json({
                ok: true,
                statusCode: 200,
                message: `Welcome ${email}`,
                details: { token },
            });
        }
        else {
            return res.status(401).json({
                ok: false,
                statusCode: 401,
                message: "Authentication Fails",
                details: "",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            statusCode: 500,
            message: "Internal Server Error",
            details: error,
        });
    }
}));
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Authentication server running on port: ${port}`);
});
