require('dotenv').config();
const cors = require('cors');
const express = require('express');
const weather = require('./data/weather.json')

const app = express();

app.use(cors());

const PORT = process.env.PORT

let sendHello = (req,res) => {
    console.log('this stuff is so cool');
}

class Forecast {
    constructor(date,description){
        this.date = date;
        this.description = description;
    }

}

// pulls out the creation of part of the decription that will be passed back to application
let createDescription = (element) => {
    let des = `"Low of ${element.low_temp}, high of ${element.high_temp} with ${element.weather.description}"`
    return des;
}


// function takes in query to check it against teh weather data
let searchWeather = (req,res) => {
    let searchReference = req.query;
    
    console.log(searchReference);

    //grabs first element that matches there conditionals
    let cityResponse = weather.find(element => element.city_name.toLowerCase() === searchReference.city_name.toLowerCase() && Math.floor(element.lat) == Math.floor(searchReference.lat) && Math.floor(element.lon) == Math.floor(searchReference.lon));

    //once city response is defined then create Forecast objects
    if(cityResponse){

        let dayForecast = [];

        cityResponse.data.map(element => {
            let des = createDescription(element);
            let date = element.valid_date;
            dayForecast.push(new Forecast(date,des));
            });

        res.send(dayForecast);
        res.send(console.log(element));
        
    }

    // if no element is found send back status 403
    else{
            res.status(403).send('not found')
        }
}

let errorControl = (req,res) => {
    if(req){
        res.status(200).send('Okay');
    }
    else{
        res.status(500).send('It is bad no');
    }
}




app.get('/hello',sendHello)
app.get('/weather',searchWeather)
app.get('/*',errorControl)



app.listen(3001, () => console.log(`I'm A Live! And i am listen at port: ${PORT}`))
