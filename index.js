require('dotenv').config();
const cors = require('cors');
const express = require('express');
const weather = require('./data/weather.json')
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;
const weatherAPI = process.env.WEATHER_API_KEY;
const movieAPI = process.env.MOVIE_API_KEY;


// test life
let sendHello = (req,res) => {
    console.log('this stuff is so cool');
}

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


// constructor to manage and form the data to send back to the client
class WeatherForecast {
    constructor(obj){
        this.hour = obj.valid_date;
        this.tempMax = obj.app_max_temp;
        this.tempMin = obj.app_min_temp
        this.pop = obj.pop;
        this.weather = obj.weather;
    }
}


// function takes in query to request by lat and lon from weather api
let searchWeather = async(req,res) => {
    
    // captures the query object from the client
    let searchReference = req.query;
    console.log(searchReference);

    
    // creates url to use with weather api based off of query object
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${searchReference.lat}&lon=${searchReference.lon}&key=${weatherAPI}&days=5`;
    console.log(url);

    try{
        // make the request to weather api
        let response = await axios(url);
        console.log(response.data);

        // refer to weather api hourly for form of data
        // want to capture timestamp_local(forecasted hour), app_temp(apparent temperature), pop(probability of percipitation), weather( the entire object contains: icon, code, description)
        let returnedHours = response.data.data;

        // creates array of WeatherForecast Objects
        let formattedData = returnedHours.map(element => new WeatherForecast(element));
        console.log(formattedData);

        // sends back the array
        res.status(200).send(formattedData);

    }
    catch(e){
        if(e){
            res.status(500).send('something is broken')
        }
    }
}

// covers all unexpected requests  
let errorControl = (req,res) => {
    if(req){
        res.status(200).send('Okay');
    }
    else{
        res.status(500).send('It is bad no');
    }
}




app.get('/hello',sendHello);
app.get('/movies',searchMovies);
app.get('/weather',searchWeather);
app.get('/*',errorControl);



app.listen(PORT, () => console.log(`I'm A Live! And i am listen at port: ${PORT}`))
