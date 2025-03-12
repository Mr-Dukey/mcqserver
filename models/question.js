const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    options:{
        option1:{
            type:String,
            required:true
        },
        option2:{
            type:String,
            required:true
        },
        option3:{
            type:String,
            required:true
        },
        option4:{
            type:String,
            required:true
        }
    },
    answer:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('question_collection', questionSchema);