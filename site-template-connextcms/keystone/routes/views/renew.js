// This view allows users to renew their rental device.

var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'renew';

  // Render the view
  view.render('renew');
};
