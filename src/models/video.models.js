import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = Schema({
    videoFile: {
        type: String,
        required: [true, "Video link not uploaded"]
    },
    thumbnail: {
        type: String,
        required: [true, "Video link not uploaded"],
        default: "default thumbnail"
    },
    description: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Video", videoSchema);
