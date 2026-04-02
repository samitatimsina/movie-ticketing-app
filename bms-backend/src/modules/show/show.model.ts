import mongoose, { Schema } from "mongoose";
import { IShow } from "./show.interface";

const showSchema = new Schema<IShow>({
    movie: {type:Schema.Types.ObjectId,ref:"Movie", required:true},
    theater: {type:Schema.Types.ObjectId,ref:"Theater", required:true},
    location:{type:String,required:true},
    format:{
        type:String,
        enum:["2D","3D","IMAX"],
        required:true
    },
    audioType:{type:String,default:"Dolby"},
    showDate: { type: Date, required: true },   
    startTime: { type: Date, required: true }, 
    endTime: { type: Date, required: true },  
    priceMap:{type:Map,of:Number,required:true,default:{}},
    seatLayout:[]
},{timestamps:true});

const Show = mongoose.model("Show", showSchema);
export default Show;