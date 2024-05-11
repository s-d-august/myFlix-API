const express = require('express');
const app = express();

app.get('/movies', (req, res, next) => {
    res.json()
});

app.get('/', (req, res, next) => {
    res.send('This is a default text response.')
});