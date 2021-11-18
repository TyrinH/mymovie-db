const Movie = require('../models/movie');

module.exports.index = async (req, res) => {
    const movies = await Movie.find({})
    res.render('movies/index', { movies })
  }

module.exports.renderNewForm = (req, res) => {
    res.render('movies/new')
  }

module.exports.createMovie = async (req, res, next) => {
    const newMovie = new Movie(req.body)
    newMovie.author = req.user._id;
    await newMovie.save();
    req.flash('success', 'Successfully made a new movie!')
    res.redirect(`movies/${newMovie._id}`)
  }

module.exports.showMovie = async (req, res) => {
    const movie = await Movie.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path:'author'
      }
      }).populate('author');
    if (!movie) {
      req.flash('error', 'Movie not found.')
      return res.redirect('/movies')
    }
    res.render('movies/show', { movie })
  }

module.exports.renderEditForm = async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      req.flash('error', 'Movie not found.')
      return res.redirect('/movies')
    }
    res.render('movies/edit', { movie })
  }

module.exports.editMovie = async (req, res) => {
    const { id } = req.params;
    const movieChange = await Movie.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    req.flash('success', 'Successfully updated movie!')
    res.redirect(`/movies/${movieChange._id}`)
  
  }

module.exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted a movie!')
    res.redirect('/movies')
  
  }