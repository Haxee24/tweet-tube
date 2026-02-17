import mongoose, {Schema} from 'mongoose';

const subSchema = new Schema({
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export default mongoose.model("Subscription", subSchema);