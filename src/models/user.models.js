import mongoose, {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary url
        default: "random select from defaults",
    },
    coverImage: {
        type: String,
        default: "defaultimg"
    },
    watchHistory: [ {
            type: Schema.Types.ObjectId,
            ref: "Video"
    } ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")){
        return;
    }
    this.password = bcrypt.hash(this.password, 10);
    next();
});

