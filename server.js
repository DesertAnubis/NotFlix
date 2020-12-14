
var express = require('express');
var app = express();
const request = require('request');
const router = express.Router()
const bodyParser = require('body-parser');
const sanitizer = require('sanitizer');

// Import in the sql libraries
const { sql,poolPromise } = require('./DB/dbPool')

//const routes = require( "./routes" );

// Set up the server
// process.env.PORT is related to deploying on AWS
var server = app.listen(process.env.PORT || 5000, listen);
module.exports = server;
path = require('path');

//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Inject your routes in here

/* # # # # # Main Page # # # # # */

// Get Page
app.get('/', async(req, res) => {
  console.log("Hello!");
  try {
    res.render('public/index');
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// Navigate to MovieSelect
app.post('/', async(req, res) => {
  console.log("(Clicked enter)");
  if (typeof req.body.enter !== 'undefined' && req.body.enter === 'true') {
    res.redirect('/MovieSelect/');
    return;
  }
});

/* # # # # # Movie Selection Page # # # # # */

// Get Page
app.get('/MovieSelect/', async(req, res) => {
  console.log("Navigating to /MovieSelect/");
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('EXEC MoviesGet;');

    // console.table(result.recordset);

    res.render('public/MovieSelect', { movies: result.recordset });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// Filter Search
app.post('/MovieSelect', async(req, res) => {
  console.log("Searching for " + req.body.txtSearch);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('input_param', sql.NVarChar, '%' + req.body.txtSearch + '%')
      .query('EXEC MovieSearchByText @input_param;');

    // console.table(result.recordset);

    res.render('public/MovieSelect', { search: true, movies: result.recordset });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

/* # # # # # Movie Page # # # # # */

// Get Page
app.get('/movie/:id', async(req, res) => {
  console.log("Navigating to /movie/" + req.params.id);
  try {
    const inputVal = sanitizer.sanitize(req.params.id);
    const pool = await poolPromise;
    const result = await pool.request()
    .input('input_parameter', sql.Int, inputVal)
      .query('EXEC MovieGetByID @input_parameter;');

    // console.table(result.recordset);

    res.render('public/movie', { movie: result.recordset[0] });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// Watch movie or trailer
app.post('/movie/:id', async(req, res) => {
  if (typeof req.body.watch !== 'undefined' && req.body.watch === 'true') {
    console.log("Watching movie");
    res.redirect('/watch/' + sanitizer.sanitize(req.params.id));
  } else if (typeof req.body.trailer !== 'undefined' && req.body.trailer === 'true') {
    console.log("Watching trailer");
    res.redirect('/trailer/' + sanitizer.sanitize(req.params.id));
  }
});

/* # # # # # Watch Movie # # # # # */

// Get Movie
app.get('/watch/:id', async(req, res) => {
  console.log("Navigating to /watch/" + req.params.id);
  try {
    const inputVal = sanitizer.sanitize(req.params.id);
    const pool = await poolPromise;
    const result = await pool.request()
    .input('input_parameter', sql.Int, inputVal)
      .query('EXEC MovieGetByID @input_parameter;');

    // console.table(result.recordset);

    res.render('public/watch', { movie: result.recordset[0] });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

/* # # # # # Watch Trailer # # # # # */

// Get Trailer
app.get('/trailer/:id', async(req, res) => {
  console.log("Navigating to /trailer/" + req.params.id);
  try {
    const inputVal = sanitizer.sanitize(req.params.id);
    const pool = await poolPromise;
    const result = await pool.request()
    .input('input_parameter', sql.Int, inputVal)
      .query('EXEC MovieGetByID @input_parameter;');

    // console.table(result.recordset);

    res.render('public/trailer', { movie: result.recordset[0] });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

/* # # # # # Genres # # # # # */

// Get Page
app.get('/Genres/', async(req, res) => {
  console.log("Navigating to /Genres/");
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('EXEC GenresGet;');

    // console.table(result.recordset);

    res.render('public/Genres', { genres: result.recordset });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// Get Page
app.get('/genre/:id', async(req, res) => {
  console.log("Navigating to /genre/" + req.params.id);
  try {
    const inputVal = sanitizer.sanitize(req.params.id);
    const pool = await poolPromise;
    const result = await pool.request()
    .input('input_parameter', sql.Int, inputVal)
      .query('EXEC GenreGetMovies @input_parameter;');

    // console.table(result.recordset);

    res.render('public/MovieSelect', { movies: result.recordset });
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// End routes

// Set the folder for public items
publicDir = path.join(__dirname,'public');
app.use(express.static(publicDir))
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }))

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}
