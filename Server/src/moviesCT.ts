import Movie from '../models/movie';


module.exports.index = async (req, res) => {
    const movies = await Movie.find();
    res.render('movies/index', { movies });
    }