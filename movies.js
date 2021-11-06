'use strict'
require('dotenv').config();
const axios = require('axios');
let cache = require('./cache.js');

const movieAPI = process.env.MOVIE_API_KEY;

class Movies {
    constructor(movie){
        this.id = movie.id
        this.title = movie.original_title;
        this.overview = movie.overview;
        this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
}

// function to take in location and return movies that are playing in that country
let searchMovies = async(req,res) => {
    let movieSearch = req.query.keyword;

    const key = `movie - ${movieSearch}`;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&language=en-US&query=${movieSearch}&page=1&include_adult=false`;

    if(cache[key]){
        console.log('Cache hit');
        res.status(200).send(cache[key]);
    } else {
        console.log('Cache miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();
        try{
            let response = await axios(url);
    
            let moviesUnmod = response.data.results;
    
            let movieMod = moviesUnmod.map(element => new Movies(element));
            cache[key].data = movieMod;
            
            res.status(200).send(movieMod);
        }
        catch (e) {
            if(e){
                res.status(404).send('There was a problem on our end')
            }
        } 
    }

}

module.exports = searchMovies;