const express = require('express')
const app = express()
const port = 3000

//Mongoose connection to DB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myMovie');



app.get('/', (req, res) => {
    res.send('HELLO WORLD!')
})

app.listen(port, () => {
    console.log('CONNECTION ESTABLISHED ON PORT 3000')
})