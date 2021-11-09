const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const { movieSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Review = require('./models/review')

//Mongoose connection to DB
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}

//Movie Schema
const Movie = require('./models/movie');


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//Middleware
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

app.get('/movies', catchAsync(async (req, res) => {
  const movies = await Movie.find({})
  res.render('movies/index', { movies })
}))

app.get('/movies/new', (req, res) => {
  res.render('movies/new')
})

app.post('/movies', validateMovie, catchAsync(async (req, res, next) => {
  const newMovie = new Movie(req.body)
  await newMovie.save();
  res.redirect(`movies/${newMovie._id}`)
}))

app.get('/movies/:id', catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('reviews');
  res.render('movies/show', { movie })
}))

app.get('/movies/:id/edit', catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.render('movies/edit', { movie })
}))

app.put('/movies/:id', validateMovie, catchAsync(async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
  res.redirect(`/movies/${movie._id}`)

}))

app.delete('/movies/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id)
  res.redirect('/movies')

}))

app.post('/movies/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  const review = new Review(req.body);
  movie.reviews.push(review);
  await review.save();
  await movie.save();
  
  res.redirect(`/movies/${movie._id}`);
}))

app.delete('/movies/:id/reviews/:reviewId', catchAsync(async(req, res)=>{
  const { id, reviewId } = req.params;
  await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/movies/${id}`);
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh, no something went wrong!'
  res.status(statusCode).render('error', { err });
})



app.listen(port, () => {
    console.log('CONNECTION ESTABLISHED ON PORT 3000')
})