"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingPasswordField = exports.missingEmailField = void 0;
const express_validator_1 = require("express-validator");
exports.missingEmailField = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email field is required")
        .isEmail()
        .withMessage("Invalid email address")
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                statuscode: 400,
                message: "email field is required",
                details: errors.array(),
            });
        }
        next();
    },
];
exports.missingPasswordField = [
    (0, express_validator_1.body)("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .not()
        .matches(/\s/)
        .withMessage("Password cannot contain spaces")
        .not()
        .isIn(["1234", "admin"])
        .withMessage("Password cannot be a common or weak password")
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                statusCode: 400,
                message: "Password Field Is Required",
                details: errors.array(),
            });
        }
        next();
    },
];
