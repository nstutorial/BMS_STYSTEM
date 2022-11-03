const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    image:{
        type:String,
        default:''
    },
    comments:{
        type:Object,
        default:{}
    }
});

module.exports = mongoose.model('Post',postSchema);