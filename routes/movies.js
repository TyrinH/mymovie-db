const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Movie = require('../models/movie');
const { movieSchema } = require('../schemas.js')
const isLoggedIn  = require('../middleware')


const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


//Routes for movies

router.get('/', catchAsync(async (req, res) => {
  const movies = await Movie.find({})
  res.render('movies/index', { movies })
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('movies/new')
})

router.post('/', isLoggedIn, validateMovie, catchAsync(async (req, res, next) => {
  const newMovie = new Movie(req.body)
  await newMovie.save();
  req.flash('success', 'Successfully made a new movie!')
  res.redirect(`movies/${newMovie._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('reviews');
  if (!movie) {
    req.flash('error', 'Movie not found.')
    return res.redirect('/movies')
  }
  res.render('movies/show', { movie })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie) {
    req.flash('error', 'Movie not found.')
    return res.redirect('/movies')
  }
  res.render('movies/edit', { movie })
}))

router.put('/:id', isLoggedIn, validateMovie, catchAsync(async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  req.flash('success', 'Successfully updated movie!')
  res.redirect(`/movies/${movie._id}`)

}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id)
  req.flash('success', 'successfully deleted a movie!')
  res.redirect('/movies')

}))

module.exports = router;