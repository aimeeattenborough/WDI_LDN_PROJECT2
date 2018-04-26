const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(user => {
      if(!user || !user.validatePassword(req.body.password)) {
        req.flash('info', 'Invalid credentials');
        return res.redirect('/login');
      }
      // store the logged in user's ID into the session cookie (session is not req'ed as it as attached to .res in the create route)
      // session cookie is sent to me in the request, need to check whether there is a userId in there
      req.session.userId = user._id;
      req.flash('success', `Welcome ${user.username}!`);

      res.redirect('/visors');
    })
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
