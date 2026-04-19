import mongoose , {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        comment : {
            type : Schema.Types.ObjectId,
            ref: "Comment"
        },
        createdAt : {
            type : Date,
            default : Date.now
        },
        updatedAt : {
            type : Date,
            default : Date.now
        },
        video : {
            type : Schema.Types.ObjectId,
            ref : "Video",
        },
        likedBy : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        tweet : {
            type : Schema.Types.ObjectId,
            ref : "Tweet",
        }
    },{
        timestamps : true
    }
)

const Like = mongoose.model("Like" , likeSchema)