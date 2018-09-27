// require
const express = require('express');
const bodyParser = require('body-parser');
const manageRouter = require('./routes/manage.router');
const entryRouter = require('./routes/entry.router');

// global
const app = express();
const PORT = process.env.PORT || 5000;

// use
app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// router
app.use('/manage', manageRouter);
app.use('/entry', entryRouter);

// listen
app.listen(PORT, () => {
    console.log('Listening on PORT :', PORT);
})