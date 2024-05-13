const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

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

// Returns data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }))
})

// Returns data about a genre by name
app.get('/movies/genres/:genre', (req, res) => {
    res.send('Successful GET request returning data on the genre.')
})

// Returns data about a director by name
app.get('/movies/directors/:director', (req, res) => {
    res.send('Successful GET request returning data on the director.')
})

// Allows new users to register
app.post('/users', (req, res) => {
    res.send('Successful POST request registering new user.')
})

// Allows users to update their username
app.put('/users/:username/:newUsername', (req, res) => {
    res.send('Successful PUT request changing username.')
})

// Allows users to add a movie to their list of favorites
app.post('/users/:username/favorites', (req, res) => {
    res.send('Successful POST request adding movie to favorites.')
})

// Allows users to remove a movie from their list of favorites
app.delete('/users/:username/favorites', (req, res) => {
    res.send('Successful DELETE request removing movie from favorites.')
})

// Allows existing users to deregister
app.delete('/users/:username', (req, res) => {
    res.send('Successful DELETE request removing user.')
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

// Listener
app.listen(8080, () => {
    console.log('Listening on port 8080.')
})