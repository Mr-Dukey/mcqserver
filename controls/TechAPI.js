const express = require('express');
const router = express.Router();
const { google } = require("googleapis");
const multer = require('multer');

const Tech = require('../models/tech');
const fs = require('fs');

const CredentialPath = 'idmexam-c9b2b55b029d.json';
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
    keyFile: CredentialPath,
    scopes: SCOPES
});

const drive = google.drive({ version: 'v3', auth });
const storage = multer.diskStorage({
    destination:'Uploads/'
});

const upload = multer({ storage });


router.post('/upload', upload.single('file'), async (req, res) => {
    try {

        const fileMetadata = { name: req.file.originalname, parents: ["1NWbISgTWkjODnm2iDU7WxuXVN99jRd5G"] }; // Replace with your Google Drive folder ID
        const media = { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        const fileId = response.data.id;
        const fileLink = `https://drive.google.com/uc?id=${fileId}`;

        await Tech.create({
            Title: req.body.title,
            Link: fileLink,
            fId:fileId
        })
            .then(() => {

                res.send(`File uploaded successfully: ${req.file.originalname}`);
            })
    }   
    catch (error) {
        res.status(500).send(`Error uploading file: ${error.message}`);
    }
});

router.get('/get', async function(req,res){
    await Tech.find()
    .then(function(file){
        res.send(file).status(200);
    })
    .catch(error=>{
        res.status(500).send(`Error uploading file: ${error.message}`);
    })
})

router.delete('/delete/:id', async function(req,res){
    const fileId = await Tech.findById(req.params.id);

    await drive.files.delete({ fileId: fileId.fId })
    .then(() => {
        Tech.findByIdAndDelete(req.params.id)
       .then(() => {
        res.send({ message: "file deleted" }).status(200);
       })
       .catch((err) => {
        res.status(400).json({ message: err.message });
       });
    })
    .catch(error=>{
        res.status(500).send(`Error deleting file: ${error.message}`);
    })
   
})

module.exports = router;