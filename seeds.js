const mongoose = require('mongoose');
const Movie = require('./models/movie');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}

const seedMovies = [
    {
        title: 'Spirited Away',
        rating: 8.6,
        release: 2001
    },
    {
        title: 'Interstellar',
        rating: 8.6,
        release: 2014
    },
    {
        title: 'Apocalypto',
        rating: 7.8,
        release: 2006
    
    },
    {
        title: 'Walk the Line',
        rating: 7.8,
        release: 2005
    },
    {
        title: 'Rocketman',
        rating: 7.3,
        release: 2019
    },
    {
        title: 'Selena',
        rating: 6.8,
        release: 1997
    },
    {
        title: 'Bird Box',
        rating: 6.6,
        release: 2018
    }
]

Movie.insertMany(seedMovies);
