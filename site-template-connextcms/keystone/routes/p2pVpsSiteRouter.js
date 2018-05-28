var keystone = require('keystone')
var middleware = require('./middleware')
var importRoutes = keystone.importer(__dirname)

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api')
}

module.exports = function (app) {
  // Keystone Views
  app.get('/test', routes.views.test);
  app.get('/createaccount', routes.views.createaccount);
  // app.get('/appdashboard', routes.views.appdashboard);
  app.get('/renew', routes.views.renew);

  app.all('/api/portcontrol/create', keystone.middleware.api, routes.api.portcontrol.create)
  app.get('/api/portcontrol/:id/remove', keystone.middleware.api, routes.api.portcontrol.remove)

  // Simple stand-alone function for users to retrieve their ID when logged in, or notify if they are not logged in.
  app.get('/api/getUserId', keystone.middleware.api, routes.api.devicePublicData.getUserId)

  app.get('/api/devicePublicData/list', keystone.middleware.api, routes.api.devicePublicData.list)
  app.all('/api/devicePublicData/create', keystone.middleware.api, routes.api.devicePublicData.create)
  app.all('/api/devicePublicData/:id/update', keystone.middleware.api, routes.api.devicePublicData.update)
  app.get('/api/devicePublicData/:id/remove', keystone.middleware.api, routes.api.devicePublicData.remove)
  app.all('/api/devicePublicData/:id/register', keystone.middleware.api, routes.api.devicePublicData.register)
  app.get('/api/devicePublicData/listById', keystone.middleware.api, routes.api.devicePublicData.listById)
  app.get('/api/deviceCheckIn/:id', keystone.middleware.api, routes.api.devicePublicData.checkIn)
  app.get('/api/devicePublicData/:id', keystone.middleware.api, routes.api.devicePublicData.getId)
  app.get('/api/getDeviceExpiration/:id', keystone.middleware.api, routes.api.devicePublicData.getExpiration)

  app.get('/api/devicePrivateData/listById', keystone.middleware.api, routes.api.devicePrivateData.listById)
  app.all('/api/devicePrivateData/create', keystone.middleware.api, routes.api.devicePrivateData.create)
  app.all('/api/devicePrivateData/:id/update', keystone.middleware.api, routes.api.devicePrivateData.update)
  app.get('/api/devicePrivateData/:id/remove', keystone.middleware.api, routes.api.devicePrivateData.remove)
  app.get('/api/devicePrivateData/:id', keystone.middleware.api, routes.api.devicePrivateData.getId)

  app.all('/api/rentedDevices/add/:id', keystone.middleware.api, routes.api.rentedDevices.add)
  app.all('/api/rentedDevices/remove/:id', keystone.middleware.api, routes.api.rentedDevices.remove)
  app.all('/api/rentedDevices/list', keystone.middleware.api, routes.api.rentedDevices.list)
  app.get('/api/rentedDevices/renew/:id', keystone.middleware.api, routes.api.rentedDevices.renew)

  // OpenBazaar Interface APIs
  app.get('/api/ob/createMarketListing/:id', keystone.middleware.api, routes.api.openbazaar.createMarketListing)
  app.get('/api/ob/removeMarketListing/:id', keystone.middleware.api, routes.api.openbazaar.removeMarketListing)
  app.get('/api/ob/updateListing/:id', keystone.middleware.api, routes.api.openbazaar.updateListing)

  // obContract API - Note: For prototyping. Not all these APIs will remain available.
  app.get('/api/obContract/list', keystone.middleware.api, routes.api.obContract.list)
  app.all('/api/obContract/create', keystone.middleware.api, routes.api.obContract.create)
  app.get('/api/obContract/:id', keystone.middleware.api, routes.api.obContract.get)
  app.all('/api/obContract/:id/update', keystone.middleware.api, routes.api.obContract.update)
  app.get('/api/obContract/:id/remove', keystone.middleware.api, routes.api.obContract.remove)

  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);
  // app.get('/loggedinuser', middleware.requireUser, routes.views.loggedinuser);
  app.get('/market', middleware.requireUser, routes.views.market)
}
