const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const methodOverride = require('method-override')

//Mongoose connection to DB
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}

const Movie = require('./models/movie');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Middleware
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

app.get('/movies', async (req, res) => {
  const movies = await Movie.find({})
    res.render('movies/index', { movies })
})

app.listen(port, () => {
    console.log('CONNECTION ESTABLISHED ON PORT 3000')
})