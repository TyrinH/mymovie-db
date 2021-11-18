const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Movie = require('../models/movie');
const { movieSchema } = require('../schemas.js')
const isLoggedIn = require('../middleware')
const movies = require('../controllers/movies')


const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

const isAuthor = async (req, res, next) => {
  const { id } = req.params
  const movie = await Movie.findById(id);
  if (!movie.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do this')
    return res.redirect(`/movies/${id}`);
  }
  next();
}


//Routes for movies

router.get('/', catchAsync(movies.index));

router.get('/new', isLoggedIn, movies.renderNewForm);

router.post('/', isLoggedIn, validateMovie, catchAsync(movies.createMovie));

router.get('/:id', catchAsync(movies.showMovie));

router.get('/:id/edit', isLoggedIn, isAuthor,  catchAsync(movies.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateMovie, catchAsync(movies.editMovie))

router.delete('/:id', isAuthor, catchAsync(movies.deleteMovie))

module.exports = router;