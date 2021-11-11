const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Movie = require('../models/movie');
const Review = require('./models/review')
const { movieSchema, reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }



//Routes for review model

router.post('/movies/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    const review = new Review(req.body);
    movie.reviews.push(review);
    await review.save();
    await movie.save();
    
    res.redirect(`/movies/${movie._id}`);
  }))
  
  router.delete('/movies/:id/reviews/:reviewId', catchAsync(async(req, res)=>{
    const { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/movies/${id}`);
  }))

  module.exports = router;