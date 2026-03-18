import mongoose , {Schema} from "mongoose";

const playlistSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        description : {
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
        videos : [ // [] is because in playlist we may add multiple videos
            {
                type : Schema.Types.ObjectId,
                ref : "Video",
            }
        ],
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },{
        timestamps : true
    }
)

const Playlist = mongoose.model("Playlist" , playlistSchema)