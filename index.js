const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models');

mongoose.connect('mongodb://localhost:27017/myflix');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

// Returns a list of ALL movies
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Returns data about a single movie by title
app.get('/movies/:title', async (req, res) => {
    await Movies.findOne({Title: req.params.title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err)
    })
})

// Returns data about a genre by name
app.get('/movies/genres/:genre', async (req, res) => {
    await Movies.findOne({"Genre.Name" : req.params.genre})
    .then((movie) => {
        res.json(movie.Genre)
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err)
    })
})

// Returns data about a director by name
app.get('/movies/directors/:director', async (req, res) => {
    await Movies.findOne({"Director.Name" : req.params.director})
    .then((movie) => {
        res.json(movie.Director)
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err)
    })
})

// Allows new users to register
/* We’ll expect JSON in this format
{
  Name: String
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
            .create({
                Name: req.body.Username,
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) => {
                return res.status(201).json(user)
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error)
    })
})

// Allows users to update their info
/* We’ll expect JSON in this format
{
  Name: String,
  (required)
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:username', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.username}, {$set:
        {
            Name: req.body.name,
            Username: req.body.username,
            Password: req.body.password,
            Email: req.body.email,
            Birthday: req.body.birthday
        }
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
})

// Allows users to add a movie to their list of favorites
app.post('/users/:username/movies/:movieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username}, {
        $push: {Favorites: req.params.movieID}
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
})

// Allows users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username}, {
        $pull: {Favorites: req.params.movieID}
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
})

// Allows existing users to deregister
app.delete('/users/:username', async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.username})
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.username + 'was not found.');
        } else {
            res.status(200).send(req.params.username + 'was deleted.')
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
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