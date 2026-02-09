import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res, ) => {
    const {fullname, email, username, password} = req.body;
    if ([fullname, email, username, password].some(field => field?.trim() === '')){
        throw ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
        $or: [
            {email},
            {username}
        ]
    });

    if (existedUser){
        throw ApiError(409, "User with the same email or username already exists");
    }

    const profilePhotoLocal = await req?.files?.profilePicture?.[0]?.path;
    const coverPhotoLocal = await req?.files?.coverPicture?.[0]?.path;

    if (!profilePhotoLocal){
        throw ApiError(400, "Profile picture is required");
    }

    const profilePhotoUrl = await uploadToCloudinary(profilePhotoLocal);
    const coverPhotoUrl = coverPhotoLocal ? await uploadToCloudinary(coverPhotoLocal) : "";

    if (!profilePhotoUrl){
        throw ApiError(500, "Failed to upload profile picture");
    }

    const user = User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: profilePhotoUrl,
        coverImage: coverPhotoUrl
    });

    const createdUser = await User.findById(user.__id).select(
        "-password -refreshToken -updatedAt -__v"
    );

    if (!createdUser){
        throw ApiError(500, "Something went wrong while creating user account");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User account created successfully") );

} );

export {registerUser};