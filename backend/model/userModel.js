import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique:false
    },
    email:{
        type : String,
        required : true,
        unique:true
    },
    password:{
        type : String,
        required : true
    },
    imageUrl:{
        type:String
    },
    phone:{
        type:Number,
        unique:true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema)

export default User