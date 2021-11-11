const express = require('express');
const router = express.Router()


//Routes for movies

router.get('/movies', catchAsync(async (req, res) => {
    const movies = await Movie.find({})
    res.render('movies/index', { movies })
  }))
  
  router.get('/movies/new', (req, res) => {
    res.render('movies/new')
  })
  
  router.post('/movies', validateMovie, catchAsync(async (req, res, next) => {
    const newMovie = new Movie(req.body)
    await newMovie.save();
    res.redirect(`movies/${newMovie._id}`)
  }))
  
  router.get('/movies/:id', catchAsync(async (req, res) => {
    const movie = await Movie.findById(req.params.id).populate('reviews');
    res.render('movies/show', { movie })
  }))
  
  router.get('/movies/:id/edit', catchAsync(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    res.render('movies/edit', { movie })
  }))
  
  router.put('/movies/:id', validateMovie, catchAsync(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/movies/${movie._id}`)
  
  }))
  
  router.delete('/movies/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id)
    res.redirect('/movies')
  
  }))