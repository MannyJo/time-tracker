// require
const express = require('express');
const bodyParser = require('body-parser');

// global
const app = express();
const PORT = process.env.PORT || 5000;

// use
app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// listen
app.listen(PORT, () => {
    console.log('Listening on PORT :', PORT);
})