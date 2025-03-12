const mongoose = require('mongoose');

function dbConnection(){
    mongoose.connect(process.env.MONGODB,{
        dbName:process.env.DATABASE
    })
    mongoose.connection.on('connected',()=>{
        console.log(`Connected to MongoDB`);
    });
    mongoose.connection.on('error',(err)=>{
        console.log(`Error connecting to MongoDB: ${err}`);
        process.exit(1);
    });
}

module.exports = {dbConnection};