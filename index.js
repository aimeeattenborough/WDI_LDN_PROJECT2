
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const userAuth = require('./lib/userAuth');
const flash = require('express-flash');


const mongoose = require('mongoose');
// use promise library bluebird
mongoose.Promise = require('bluebird');

// sending requests to the controller
const router = require('./config/router');


const app = express();

const PORT = 8000;

// connecting to the database
mongoose.connect('mongodb://localhost/visors-database');

// setting up our view enginge
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// express layouts to look for template
app.use(expressLayouts);

// static file location
app.use(express.static(`${__dirname}/public`));

// capture the form data - before the router
app.use(bodyParser.urlencoded({ extended: true }));

// method-override must be after body-parser. Looking for _method in req.body - converts get/post into put, patch, delete
app.use(methodOverride(req => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method; // it's looking for _method (in edit.ejs)
    delete req.body._method;
    return method;
  }
}));
// add express-session to encrypt the session cookie, secret can be anything. session is a function
app.use(session({
  secret: 'GysHa^72u91sk0P(', // a random key used to encrypt the session cookie
  resave: false,
  saveUninitialized: false
}));


app.use(userAuth);

app.use(flash());

app.use(router);

// global error catcher
app.use((err, req, res, next) => {
  if(err.name === 'ValidationError') return res.render('pages/422');
  res.render('pages/500', { err });
  next(err);
});

// listen for incoming traffic
app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
