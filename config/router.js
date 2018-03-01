const router = require('express').Router();
const visors = require('../controllers/visors.js');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute =require('../lib/secureRoute');

// Request handlers
// HOME
router.route('/')
  .get(visors.home);

router.route('/visors/new')
  .get(secureRoute, visors.new);

router.route('/visors')
  .get(visors.index)
  .post(secureRoute, visors.create);

router.route('/visors/:id')
  .get(visors.show)
  .put(secureRoute, visors.update)
  .delete(secureRoute, visors.delete);

router.route('/visors/:id/edit')
  .get(secureRoute, visors.edit);

// REGISTRATION

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/profile')
  .get(secureRoute, registrations.profile);

// LOGIN

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

// Moderate for admin

router.route('/visors/:id/comments/:commentId/:moderate')
  .patch(secureRoute, visors.commentsModerate);

// COMMENTS
router.route('/visors/:id/comments')
  .post(secureRoute, visors.commentsCreate);

router.route('/visors/:id/comments/:commentId')
  .delete(secureRoute, visors.commentsDelete);

// FAVOURITES
router.route('/visors/:id/favourites')
  .post(secureRoute, visors.favouritesCreate)
  .delete(secureRoute, visors.favouritesDelete);

router.all('/*', (req, res) => res.render('pages/404'));

module.exports = router;
