const mongoose = require("mongoose");

const userSchema =mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    is_Admin:{
        type:String,
        require:true
    },
    token:{
        type:String,
        default:''
    }
    
});
module.exports =mongoose.model("User",userSchema);