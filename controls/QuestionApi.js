const express = require('express');
const router = express.Router();
const Questions = require('../models/question');
router.get('/questions', async function(req,res){
    await Questions.find()
    .then((question)=>{
        res.send(question).status(200);
    })
    .catch((err)=>{
        res.status(400).json({message:err.message});
    })
})

router.post('/create', async function(req,res){
    const {question, option1, option2, option3, option4, answer} = req.body;
    await Questions.create({
        question,
        options:{
            option1,
            option2,
            option3,
            option4
        },
        answer
    })
   .then(()=>{
    res.send({message: "question created"}).status(200);
   })
   .catch((err)=>{
    console.log({message:err.message});
    
    res.status(400).json({message:err.message});
   })
});

router.get('/question/:id', async function (req,res) {
    await Questions.findById(req.params.id)
    .then((question) => {
        res.send(question).status(200);
    })
    .catch((err) => {
        res.status(400).json({ message: err.message });
    });
})

router.put('/update/:id', async function(req,res){
    const {question, option1, option2, option3, option4, answer} = req.body;
    await Questions.findByIdAndUpdate(req.params.id, {
        question,
        options:{
            option1,
            option2,
            option3,
            option4,
        },
        answer
    })
   .then(()=>{
    res.send({message: "question updated"}).status(200);
   })
   .catch((err)=>{
    res.status(400).json({message:err.message});
   })
})

router.delete('/delete/:id', async function(req,res){
    await Questions.findByIdAndDelete(req.params.id)
   .then(()=>{
    res.send({message: "question deleted"}).status(200);
   })
   .catch((err)=>{
    res.status(400).json({message:err.message});
   })
})

module.exports = router;