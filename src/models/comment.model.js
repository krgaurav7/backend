import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    { 
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
        },
        video : {
            type : Schema.Types.ObjectId,
            ref : "Video",
            required : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },{
        timestamps : true
    }
)

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("comment" , commentSchema)