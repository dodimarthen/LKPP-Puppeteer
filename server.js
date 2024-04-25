const express = require('express');
const mongoose = require('mongoose');
const { uri_mongodb } = require('./config');

const app = express();

const uri = uri_mongodb

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Ping accomplished! Connected to mongoDB");
    } catch (error){
        console.log(error);
    }
}
connect();

app.listen(8000, () => {
    console.log("Server started on port 8000");
})