const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Movie = require('../models/movie');
const Review = require('../models/review')
const { movieSchema, reviewSchema } = require('../schemas.js')
const isLoggedIn = require('../middleware')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do this')
      return res.redirect(`/movies/${id}`);
    }
    next();
  }
  



//Routes for review model

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    const review = new Review(req.body);
    review.author = req.user._id;
    movie.reviews.push(review);
    await review.save();
    await movie.save();
    req.flash('success', 'created new review!')

    res.redirect(`/movies/${movie._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted a review!')
    res.redirect(`/movies/${id}`);
}))

module.exports = router;