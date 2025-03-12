const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Phone:{
        type: Number,
        required: true,
        unique: true
    },
    Email:{
        type: String,
        required: true,
        unique: true
    },
    Password:{
        type: String,
        required: true
    },
    Role:{
        type: String,
        default: 'user'
    },
    Mark:{
        type: Number,
        default: 0
    },
    Domain:{
        type: String,
        required: true
    },
    Aptti:{
        type: Boolean,
        default:false
    }
})

module.exports = mongoose.model('user_collection', userSchema);