import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res, ) => {
    const {fullname, email, username, password} = req.body;
    if ([fullname, email, username, password].some(field => field?.trim() === '')){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    });

    if (existedUser){
        throw new ApiError(409, "User with the same email or username already exists");
    }

    const profilePhotoLocal = await req?.files?.profilePicture?.[0]?.path;
    const coverPhotoLocal = await req?.files?.coverPicture?.[0]?.path;

    if (!profilePhotoLocal){
        throw new ApiError(400, "Profile picture is required");
    }

    const profilePhotoUrl = await uploadToCloudinary(profilePhotoLocal);
    const coverPhotoUrl = coverPhotoLocal ? await uploadToCloudinary(coverPhotoLocal) : "";

    if (!profilePhotoUrl){
        throw new ApiError(500, "Failed to upload profile picture");
    }

    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: profilePhotoUrl,
        coverImage: coverPhotoUrl
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -updatedAt -__v"
    );

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while creating user account");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User account created successfully") );

} );    


const showProfile = async (req, res) => {
    const user = await User.findOne().select('-password -refreshToken -__v ');
    console.log(user);
    if (!user) throw new ApiError(404, "No Users Found");
    res.send(`
<div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 50px auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    border-radius: 15px;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #eee;
">
    <!-- Cover Image -->
    ${user.coverImage ? `<div style="position: relative; height: 200px; overflow: hidden;">
        <img src="${user.coverImage}" alt="Cover Image" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        " />
    </div>` : `<div style="height: 200px; background: linear-gradient(135deg, #6e8efb, #a777e3);"></div>`}

    <!-- Avatar and user info -->
    <div style=" position: relative; padding: 20px;">
        <!-- Avatar -->
        <img src="${user.avatar}" alt="Profile Picture" style="
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #fff;
            position: absolute;
             /* half of avatar height to overlap */
            left: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        " />

        <!-- User name and email -->
        <div style="margin-left: 160px; padding-top: 10px;">
            <h2 style="margin: 0; font-size: 24px; color: #333;">${user.fullname}</h2>
            <p style="margin: 5px 0 10px; color: #777; font-weight: bold;">@${user.username}</p>
        </div>
    </div>

    <div style="height: 60px;"></div> <!-- Spacer to account for overlapping avatar -->
</div>

  `);
}

export {registerUser, showProfile};