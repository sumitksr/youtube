import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },  
    chanel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
    }
},{timestamps:true}
)