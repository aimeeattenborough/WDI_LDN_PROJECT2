const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Visor = require('../models/visor');
const User = require('../models/user');
const userData = require('./data/user');
const visorData = require('./data/visors');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/visors-database', (err, db) => {
  db.dropDatabase();

  Visor.create(visorData)
    .then(visors => console.log(`${visors.length} visors created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());

  User.create(userData)
    .then(user => console.log(`${user.length} user created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
