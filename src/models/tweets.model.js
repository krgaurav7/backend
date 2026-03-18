import mongoose , {Schema} from "mongoose";

const tweetschema = new Schema(
    {
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        content : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now
        },
        updatedAt : {
            type : Date,
            default : Date.now
        }
    },{
        timestamps : true
    }
)

export const tweet = mongoose.model("tweets", tweetschema)