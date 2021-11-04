const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    release: {
        type: Number,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;