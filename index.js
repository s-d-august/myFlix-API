const express = require('express');
const app = express();

app.get('/movies', (req, res, next) => {
    res.json()
})

