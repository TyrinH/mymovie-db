const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Movie = require('../models/movie');
const Review = require('../models/review')
const { movieSchema, reviewSchema } = require('../schemas.js')
const isLoggedIn = require('../middleware')
const reviews = require('../controllers/reviews')
const ExpressError = require('../utils/ExpressError')


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

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;