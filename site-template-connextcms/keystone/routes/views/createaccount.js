var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.user = req.user;
  if (locals.user !== undefined) { locals.user.password = ''; } // Blank out password for security purposes.

        // Set locals
  locals.section = 'createaccount';

        // Render the view
  view.render('createaccount');
};
