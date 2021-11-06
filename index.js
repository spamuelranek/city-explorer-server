'use strict'

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const weather = require('./data/weather.json')
const axios = require('axios');
const searchWeather = require('./weather.js');
const searchMovies = require('./movies.js');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// test life
let sendHello = (req,res) => {
    console.log('this stuff is so cool');
    res.send('test');
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
