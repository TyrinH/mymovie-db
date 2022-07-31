const express = require('express');
const app = express();

//Mongoose connection to DB
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}