const Joi = require('joi')

module.exports.movieSchema = Joi.object({
      title: Joi.string().required(),
      rating: Joi.number().required().min(0),
      release: Joi.number().required().min(0)
  });

  module.exports.reviewSchema = Joi.object({
      body: Joi.string().required(),
      rating: Joi.number().required().min(1)
  });