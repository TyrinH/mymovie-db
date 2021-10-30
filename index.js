const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')

//Mongoose connection to DB
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}

const Movie = require('./models/movie');


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//Middleware
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

app.get('/movies', async (req, res) => {
  const movies = await Movie.find({})
  res.render('movies/index', { movies })
})

app.get('/movies/new', (req, res) => {
  res.render('movies/new')
})

app.post('/movies', async (req, res) => {
  const newMovie = new Movie(req.body)
  await newMovie.save();
  res.redirect(`movies/${newMovie._id}`)
})

app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.render('movies/show', { movie })
})

app.get('/movies/:id/edit', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.render('movies/edit', { movie })
})

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
  res.redirect(`/movies/${movie._id}`)

})

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id)
  res.redirect('/movies')

})



app.listen(port, () => {
    console.log('CONNECTION ESTABLISHED ON PORT 3000')
})