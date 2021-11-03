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

let createDescription = (element) => {
    let des = `"description": "Low of ${element.low_temp}, high of ${element.high_temp} with ${element.weater.description}"`
    return des;
}

let searchWeather = (req,res) => {
    let searchReference = req.query;
    let cityResponse = weather.find(element => {

        if(element.city_name.toLowerCase() === searchReference.city_name.toLowerCase() && Math.floor(element.lat) == Math.floor(searchReference.lat) && Math.floor(element.lon) == Math.floor(searchReference.lon)){
            let dayForecast = [];

            element.data.map(element => {
                let des = createDescription(element);
                let date = element.valid_date;
                dayForecast.push(new Forecast(date,des));
            });

            res.send(dayForecast);
            res.send(console.log(element));
        }
        else {
            res.status(403).send('not found')
        }
    });



}


app.get('/hello',sendHello)
app.get('/weather',searchWeather)



app.listen(3001, () => console.log(`I'm A Live! And i am listen at port: ${PORT}`))
