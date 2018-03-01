const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(() => res.redirect('/visors'))
    .catch(next);
}

function profileRoute(req, res) {
  res.render('registrations/profile');
}

module.exports = {
  new: newRoute,
  create: createRoute,
  profile: profileRoute
};
