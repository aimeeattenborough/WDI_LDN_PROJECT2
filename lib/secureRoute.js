// restricting behaviours. any route we want to limit to logged in we drop in the function
// router sees the request and sends it to the secureroute to see whether the user is logged in, then goes on to next.
function secureRoute(req, res, next) {
  // if the user is not logged in
  if(!req.session.userId) { //no user id in the session
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in to do that');
      res.redirect('/login'); // regenerates - clear the session cookie
    });
  }
  next();
}

module.exports = secureRoute;
