const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models'),
    cors = require('cors');

mongoose.connect(process.env.CONNECTION_URI);

const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const {check, validationResult} = require('express-validator')

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Returns a list of ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err)
        })
})

// Returns data about a genre by name
app.get('/movies/genres/:genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.genre })
        .then((movie) => {
            res.json(movie.Genre)
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err)
        })
})

// Returns data about a director by name
app.get('/movies/directors/:director', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.director })
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
app.post('/users', 
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    async (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Name: req.body.Name,
                        Username: req.body.Username,
                        Password: hashedPassword,
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
}})

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
app.put('/users/:username',
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission denied')
    }
    await Users.findOneAndUpdate(
        { Username: req.params.username },
        {
            $set: {
                Name: req.body.Name,
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            },
        },
        { new: true }
    )
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
}})

// Allows users to add a movie to their list of favorites
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
        $push: { Favorites: req.params.movieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
})

// Allows users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
        $pull: { Favorites: req.params.movieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
})

// Allows existing users to deregister
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send('User "' + req.params.username + '" was not found.');
            } else {
                res.status(200).send('User "' + req.params.username + '" has been deleted.')
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

