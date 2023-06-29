"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingPasswordField = exports.missingEmailField = void 0;
const missingEmailField = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            ok: false,
            statusCode: 400,
            message: "Email Field Is Required",
            details: "",
        });
    }
    next();
};
exports.missingEmailField = missingEmailField;
const missingPasswordField = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({
            ok: false,
            statusCode: 400,
            message: "Password Field Is Required",
            details: "",
        });
    }
    next();
};
exports.missingPasswordField = missingPasswordField;
