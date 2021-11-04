'use strict'
require('dotenv').config();
const axios = require('axios');

const movieAPI = process.env.MOVIE_API_KEY;


class Movies {
    constructor(movie){
        this.title = movie.original_title;
        this.overview = movie.overview;
        this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
}


// function to take in location and return movies that are playing in that country
let searchMovies = async(req,res) => {
    let movieSearch = req.query.keyword;


    let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&language=en-US&query=${movieSearch}&page=1&include_adult=false`;


    try{

        let response = await axios(url);

        let moviesUnmod = response.data.results;
        console.log(moviesUnmod.length);

        let movieMod = moviesUnmod.map(element => new Movies(element));

        console.log(movieMod);

        res.status(200).send(movieMod);


    }
    catch (e) {
        if(e){
            res.status(404).send('There was a problem on our end')
        }
    }
    
}

module.exports = searchMovies;