const mongoose = require('mongoose');
const Movie = require('./models/movie');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}

const seedMovies = [
    {
        title: 'Godzilla',
        rating: 5.4,
        release: 1998
    },
    {
        title: 'Interstellar',
        rating: 8.6,
        release: 2014
    },
    
]