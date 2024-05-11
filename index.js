const express = require('express'),
    morgan = require('morgan');
const app = express();

app.use(express.static('public'));

app.use(morgan('common'));

app.get('/movies', (req, res, next) => {
    res.json()
});

app.get('/', (req, res, next) => {
    res.send('This is a default text response.')
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});