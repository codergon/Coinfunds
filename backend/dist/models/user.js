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
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 55,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: false,
    },
    cardIds: {
        type: String,
    },
    payoutRecipientsIds: {
        type: String,
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg",
    },
});
//hash password before saving it to db
UserSchema.pre("save", function (next) {
    const user = this;
    if (user.isModified("password")) {
        bcrypt_1.default.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt_1.default.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
});
//compare passwords
UserSchema.methods.checkPassword = function (password, cb) {
    var user = this;
    bcrypt_1.default.compare(password, user.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
UserSchema.methods.generatetoken = function (cb) {
    const user = this;
    var token = (0, jsonwebtoken_1.sign)({ id: user._id.toString() }, config_1.LOGIN_SECRET);
    cb(null, token);
};
UserSchema.statics.findByToken = function (token, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = this;
        try {
            const { id } = (0, jsonwebtoken_1.verify)(token, config_1.LOGIN_SECRET);
            const foundUser = yield user.findOne({ _id: id, token: token });
            cb(null, foundUser);
        }
        catch (err) {
            cb(err, null);
        }
    });
};
UserSchema.methods.deletetoken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        var user = this;
        user.token = undefined;
        console.log(user);
        yield user.save();
    });
};
function arrayLimit(val) {
    return val.length <= 10;
}
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
