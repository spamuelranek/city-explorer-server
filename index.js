require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT

let sendHello = () => {
    console.log('this stuff is so cool');
}

app.get('/hello',sendHello)




app.listen(3001, () => console.log(`I'm A Live! And i am listen at port: ${PORT}`))
