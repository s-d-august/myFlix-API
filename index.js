const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require(uuid);

const app = express();

app.use(bodyParser.json());

let movies = [
    {
        title: 'The Thing',
        year: 1982,
        director: 'John Carpenter'
    },
    {
        title: 'Akira',
        year: 1988,
        director: 'Katsuhiro Otomo'
    },
    {
        title: 'The Maltese Falcon',
        year: 1941,
        director: 'John Huston'
    },
    {
        title: 'Princess Mononoke',
        year: 1997,
        director: 'Miyazaki Hayao'
    },
    {
        title: 'Neptune Frost',
        year: 2021,
        director: 'Anisia Uzeyman'
    },
    {
        title: 'House',
        year: 1977,
        director: 'Nobuhiko Obayashi'
    },
    {
        title: 'Hellraiser',
        year: 1987,
        director: 'Clive Barker'
    },
    {
        title: 'Adolescence of Utena',
        year: 1999,
        director: 'Kunihiko Ikuhara'
    },
    {
        title: 'Casablanca',
        year: 1942,
        director: 'Michael Curtiz'
    },
    {
        title: 'Mad God',
        year: 2021,
        director: 'Phil Tippett'
    }
]

app.use(express.static('public'));

app.use(morgan('common'));

// Returns a list of ALL movies
app.get('/movies', (req, res) => {
    res.json(movies);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

app.listen(8080, () => {
    console.log('Listening on port 8080.')
})