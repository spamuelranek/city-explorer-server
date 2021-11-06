'use strict'
require('dotenv').config();
const axios = require('axios');
let cache = require('./cache.js');

const weatherAPI = process.env.WEATHER_API_KEY;

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

    const key = `weather-${searchReference.lat},$${searchReference.lon}`;
  
    // creates url to use with weather api based off of query object
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${searchReference.lat}&lon=${searchReference.lon}&key=${weatherAPI}&days=5`;
    console.log(url);

    if(cache[key] && ((Date.now() - cache[key].timestamp) < 50000)){
        console.log('Cache hit');
        res.status(200).send(cache[key]);
    } else {
        console.log('Cache miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();
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
            cache[key].data = formattedData;
    
            // sends back the array
            res.status(200).send(formattedData);
        }
        catch(e){
            if(e){
                res.status(500).send('something is broken')
            }
        }
    }

}

module.exports = searchWeather;