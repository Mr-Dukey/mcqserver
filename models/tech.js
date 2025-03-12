const mongoose = require('mongoose');

const techSchema = new mongoose.Schema({
    Title:{
        type:String,
        require:true
    },
    Link:{
        type: String,
        require:true
    },
    fId:{
        type: String,
        require:true
    }
})

module.exports = mongoose.model('tech_collection', techSchema);