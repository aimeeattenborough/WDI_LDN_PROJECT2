const Visor = require('../models/visor');

// index - get data from the database and pass it into the view

function homeRoute(req, res, next) {
  Visor
    .find()
    .sort({ createdAt: -1 })
    .exec()
    .then(visors => {
      const types = Array.from(new Set(visors.map(visor => visor.type)));
      visors = visors.slice(0, 4);
      res.render('pages/home', { visors, types });
    })
    .catch(next);
}

function indexRoute(req, res) {
  if(req.query.type === 'all') req.query = {};
  Visor.find(req.query)
    .then(visors => res.render('visors/index', { visors }));
}

function newRoute(req, res) {
  res.render('visors/new');
}
function createRoute(req, res, next) {
  Visor.create(req.body)
    .then(() => res.redirect('/visors'))
    .catch(next);
}

function showRoute(req, res, next) {
  Visor.findById(req.params.id)
    .populate('comments.user')
    .then(visor => {
      if(!visor) return res.render('pages/404');
      res.render('visors/show', { visor });
    })
    .catch(next);
}

function editRoute(req, res) {
  Visor.findById(req.params.id)
    .then(visor => res.render('visors/edit', { visor }));
}

function updateRoute(req, res) {
  Visor.findById(req.params.id)
    .then(visor => Object.assign(visor, req.body))
    .then(visor => visor.save())
    .then(() => res.redirect(`/visors/${req.params.id}`));
}

function deleteRoute(req, res) {
  Visor.findById(req.params.id)
    .then(visor => visor.remove())
    .then(() => res.redirect('/visors'));
}

// Comments

function commentsCreateRoute(req, res, next) {
  req.body.user = req.currentUser;

  Visor.findById(req.params.id) //gets the visor
    .then(visor => {
      visor.comments.push(req.body);
      return visor.save();
    })
    .then(visor => res.redirect(`/visors/${visor._id}`))
    .catch(next);
}

function commentsDeleteRoute(req, res, next) {
  Visor.findById(req.params.id) //gets the visor
    .then(visor => {
      const comment = visor.comments.id(req.params.commentId); // id is find the comment by id, so that will give me the comment in the const.
      comment.remove();
      return visor.save();
    })
    .then(visor => res.redirect(`/visors/${visor._id}`))
    .catch(next);
}

// moderation
function moderate(req, res, next) {
  if(!req.currentUser.isAdmin){
    req.flash('You do not have permission to moderate');
    return res.redirect(`/visors/${req.params.id}`);
  }

  Visor.findById(req.params.id)
    .then(visor => {
      const comment = visor.comments.id(req.params.commentId);
      comment.isModerated = true;
      return visor.save();
    })
    .then(visor => res.redirect(`/visors/${visor._id}`))
    .catch(next);
}

// favourites
function favouritesCreateRoute(req, res, next) {
  req.currentUser.favourites.push(req.params.id);

  req.currentUser.save()
    .then(() => res.redirect(`/visors/${req.params.id}`))
    .catch(next);
}

// 'save new filtered array as locals.currentUser.favourites' = favourites;

function favouritesDeleteRoute(req, res, next) {
  req.currentUser.favourites = req.currentUser.favourites.filter(visor => {
    return !visor._id.equals(req.params.id);
  });
  req.currentUser.save()
    .then(() => res.redirect(`/visors/${req.params.id}`))
    .catch(next);
}


module.exports = {
  home: homeRoute,
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute,
  favouritesCreate: favouritesCreateRoute,
  favouritesDelete: favouritesDeleteRoute,
  commentsModerate: moderate
};
