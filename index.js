require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser')
const cors = require('cors');
const {dbConnection} = require('./database/dbConnection');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: process.env.CORS,
    credentials: true,
    methods: ['GET', 'HEAD','POST','PUT', 'DELETE']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser())

//DB connection
dbConnection();

// apis
const user_api = require('./controls/UserAPi');
const question_api = require('./controls/QuestionApi');
const tech_api = require('./controls/TechAPI');

//routes
app.use('/user',user_api);
app.use('/quiz',question_api);
app.use('/tech',tech_api);

//port
app.listen(port,()=>{
    console.log(`Server is running`);
});