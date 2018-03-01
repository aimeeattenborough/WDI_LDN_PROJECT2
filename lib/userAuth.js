const User = require('../models/user');


// anywhere that is use, there is data going in. authentication.
function userAuth(req, res, next) {
  // if there is no user ID, then there is nothing to do, move on to the routes
  if(!req.session.userId) return next();

  // otherwise use the ID to find the user in the database
  User
    .findById(req.session.userId)
    .populate('favourites')
    .then(user => {

      // if the user hasn't been found (perhaps if they have deleted their account)
      // log them out (ie delete the data in the session)
      if(!user) req.session.regenerate(() => res.redirect('/login'));

      // add some helpers to res.locals to be used in the views
      res.locals.isAuthenticated = true;
      res.locals.currentUser = user;

      // store the user data on `req` to be used inside the controllers
      req.currentUser = user;
      // getting hold of the data is req.

      next();
    });
}

module.exports = userAuth;
