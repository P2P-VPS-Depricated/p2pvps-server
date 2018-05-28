/*
  This file controls the APIs associated with the devicePublicData model.
*/

// Library Dependencies.
const keystone = require('keystone');
const request = require('request');
// const rp = require('request-promise');
const util = require('./lib/util.js');

// Instantiate Keystone Models
const logr = keystone.get('logr'); // Logging system
const DevicePublicModel = keystone.list('DevicePublicModel');
// const DevicePrivateModel = keystone.list('DevicePrivateModel');

// List Public Devices Models
exports.list = function (req, res) {
  logr.debug('Entering devicePublicData.js/list().');

  DevicePublicModel.model.find(function (err, items) {
    if (err) return res.apiError('database error', err)

    res.apiResponse({
      collection: items
    })
  })
}

// List any device models associated with this user, both Owner and Renter.
exports.listById = function (req, res) {
  logr.debug('Entering devicePublicData.js/listById().');

  // Get the users ID
  try {
    var userId = req.user.get('id').toString()
  } catch (err) {
    // Error handling.
    return res.apiError(
      'error',
      'Could not retrieve user ID. You must be logged in to use this API.'
    )
  }

  var ownerItems

  // Get any models that match the userId as the Owner
  var promiseGetOwnerModels = getOwnerModels(userId)
  promiseGetOwnerModels.then(
    function (results) {
      // debugger;

      ownerItems = results

      // Find all entries that have this user associated as the renter.
      var promiseGetRenterModels = getRenterModels(userId)
      promiseGetRenterModels.then(
        function (results) {
          // debugger;

          // Combine and return matching entries.
          ownerItems = ownerItems.concat(results)

          // Return the collection of matching items
          res.apiResponse({
            collection: ownerItems
          })
        },
        function (error) {
          console.error(
            'Error resolving promise for /routes/api/devicePublicData.js/getRenterModels(' +
              userId +
              '). Error:',
            error
          )
        }
      )
    },
    function (error) {
      console.error(
        'Error resolving promise for /routes/api/devicePublicData.js/getOwnerModels(' +
          userId +
          '). Error:',
        error
      )
    }
  )
}

// Create DevicePublicModel
exports.create = function (req, res) {
  logr.debug('Entering devicePublicData.js/create().');

  // debugger;

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  let item = new DevicePublicModel.model()
  let data = req.method === 'POST' ? req.body : req.query

  item.getUpdateHandler(req).process(data, function (err) {
    if (err) return res.apiError('error', err)

    res.apiResponse({
      collection: item
    })
  })
}

// Update DevicePublicModel by ID
exports.update = function (req, res) {
  logr.debug('Entering devicePublicData.js/update().');

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  // var admins = keystone.get('admins');
  // var userId = req.user.get('id');
  // if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  // }

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    var data = req.method === 'POST' ? req.body : req.query

    item.getUpdateHandler(req).process(data, function (err) {
      if (err) return res.apiError('create error', err)

      res.apiResponse({
        collection: item
      })
    })
  })
}

// Get DevicePublicModel by ID
exports.getId = function (req, res) {
  logr.debug('Entering devicePublicData.js/getId().');

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  /*
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  */

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    return res.apiResponse({
      collection: item
    })
  })
}

// Delete DevicePrivateModel by ID
exports.remove = function (req, res) {
  logr.debug('Entering devicePublicData.js/remove().');

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  /*
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  */

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    item.remove(function (err) {
      if (err) return res.apiError('database error', err)

      return res.apiResponse({
        success: true
      })
    })
  })
}

// This API is called by the RPi client to register a new device.
exports.register = async function (req, res) {
  logr.debug('Entering devicePublicData.js/register().');

  try {
    // const DEFAULT_EXPIRATION = 60000 * 60 * 24 * 30; // Thirty Days
    const DEFAULT_EXPIRATION = 60000 * 60 * 24; // One Day
    // const DEFAULT_EXPIRATION = 60000 * 60; // One Hour
    // const DEFAULT_EXPIRATION = 60000 * 8; // Testing

    // Ensure the user has a valid CSRF token
    // if (!security.csrf.validate(req)) {
    //  return res.apiError(403, 'invalid csrf');
    // }

    // Ensure the user making the request is a Keystone Admin
    // var isAdmin = req.user.get('isAdmin');
    // if(!isAdmin) {
    //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
    // }

    // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
    // This is a check to make sure the user is a ConnexstCMS Admin
    // var admins = keystone.get('admins');
    // var userId = req.user.get('id');
    // if(admins.indexOf(userId) == -1) {
    //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
    // }

    let deviceData = req.method === 'POST' ? req.body : req.query;
    let usedPort;

    // Get the devicePublicModel
    let devicePublicModel = await util.getDevicePublicModel(req.params.id);

    // Generate a new expiration date.
    const now = new Date()
    const expiration = new Date(now.getTime() + DEFAULT_EXPIRATION)

    // Save device stats to the model.
    devicePublicModel.set('memory', deviceData.memory)
    devicePublicModel.set('diskSpace', deviceData.diskSpace)
    devicePublicModel.set('processor', deviceData.processor)
    devicePublicModel.set('internetSpeed', deviceData.internetSpeed)
    devicePublicModel.set('checkinTimeStamp', deviceData.checkinTimeStamp)
    devicePublicModel.set('expiration', expiration.toISOString())
    await devicePublicModel.save()

    // Get device private model
    var privateDeviceId = devicePublicModel.get('privateData');
    let devicePrivateModel = await util.getDevicePrivateModel(privateDeviceId);

    // Get any previously used port assignment.
    usedPort = devicePrivateModel.get('serverSSHPort');

    // Get Login, Password, and Port assignment.
    const loginData = await util.getLoginPassAndPort();
    const clientData = loginData.newDevice;

    // Move any money pending to money owed.
    let newMoneyOwed = devicePrivateModel.get('moneyPending');
    const oldMoneyOwed = devicePrivateModel.get('moneyOwed');
    if (newMoneyOwed) {
      logr.debug(`Transfering $${newMoneyOwed} from moneyPending to moneyOwed.`);

      if (oldMoneyOwed) newMoneyOwed += oldMoneyOwed;

      devicePrivateModel.set('moneyOwed', newMoneyOwed);
      devicePrivateModel.set('moneyPending', 0);
    }

    // Save the data to the devicePrivateModel.
    devicePrivateModel.set('deviceUserName', clientData.username);
    devicePrivateModel.set('devicePassword', clientData.password);
    devicePrivateModel.set('serverSSHPort', clientData.port);
    await devicePrivateModel.save()

    // If a previous port was being used, release it.
    // Dev Note: Order of operation is important here. I want to release the old port
    // *after* I request a new port. Otherwise I'll run into SSH issues.
    if (usedPort) {
      // Release the used port.
      await releasePort(usedPort);
    }

    // TODO 1/16/18 check to see if obContract model already exists for this device. If so, delete that model.

    // Create an OB store listing for this device.
    // let obContractId = await util.submitToMarket(devicePublicModel);
    let obContractId = await createNewMarketListing(devicePublicModel);

    // Update the devicePublicModel with the newly created obContract model GUID.
    devicePublicModel.set('obContract', obContractId);
    await devicePublicModel.save();

    logr.log('API call to register() succeeded!')

    // Return the device model.
    return res.apiResponse({
      clientData: clientData
    });
  } catch (err) {
    debugger;
    logr.error('Error in devicePublicData.js/register2: ' + err);
    logr.error('Error stringified: ' + JSON.stringify(err, null, 2));
    return res.apiError(err);
  }
}

// Simple stand-alone function for users to retrieve their ID when logged in, or notify if they are not logged in.
exports.getUserId = function (req, res) {
  logr.debug('Entering devicePublicData.js/getUserId().');

  // Get the users ID
  try {
    var userId = req.user.get('id').toString()
    return res.apiResponse({ userId: userId })
  } catch (err) {
    // Error handling.
    return res.apiError(
      'error',
      'Could not retrieve user ID. You must be logged in to use this API.'
    )
  }
}

// This function allows Clients to check-in and notify the server they are still actively
// connected to the internet. This should happen every 2 minutes. It updates the checkinTimeStamp
// of the devicePublicModel
exports.checkIn = async function (req, res) {
  logr.debug('Entering devicePublicData.js/checkIn().');

  try {
    let devicePublicModel = await util.getDevicePublicModel(req.params.id);

    var now = new Date()
    var timeStamp = now.toISOString()

    devicePublicModel.set('checkinTimeStamp', timeStamp)
    await devicePublicModel.save()

    return res.apiResponse({
      success: true
    })
  } catch (err) {
    debugger;
    logr.error('Error in devicePublicData.js/checkIn(): ' + err);
    logr.error('Error stringified: ' + JSON.stringify(err, null, 2));
    return res.apiError(err);
  }
}

// This function allows the p2p-vps-client.js application running on the Client to download the
// expiration for the current Client. When the expiration is hit, it resets the device and wipes
// the old Docker container and persistant storage.
exports.getExpiration = async function (req, res) {
  logr.debug('Entering devicePublicData.js/getExpiration().');

  try {
    let devicePublicModel = await util.getDevicePublicModel(req.params.id);

    const now = new Date();

    let expiration = new Date(devicePublicModel.expiration);

    // If the expiration time has passed.
    if (expiration.getTime() < now.getTime()) {
      logr.log(`Removing listing for ${devicePublicModel._id}`);

      // Remove the listing from the OB store
      try {
        await util.removeOBListing(devicePublicModel);
      } catch (err) {
        logr.debug(`obContract could not be found. Skipping removal.`);
      }

      logr.log(`OB Listing for ${devicePublicModel._id} successfully removed.`);
    }

    res.apiResponse({
      expiration: devicePublicModel.expiration
    })
  } catch (err) {
    debugger;

    logr.error('Error in devicePublicData.js/getExpiration: ' + err);

    if (err.statusCode >= 500) {
      // logr.error(`Error trying to remove the OB listing for ${devicePublicModel._id}`);
      logr.error(`There was an issue with finding the listing on the OpenBazaar server. Skipping.`);
    } else {
      logr.error('Error stringified: ' + JSON.stringify(err, null, 2));
    }

    return res.apiError(err);
  }
}

/** ** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

// Get any devicePublicModels where the userId matches the ownerUser entry.
function getOwnerModels (userId) {
  logr.debug('Entering devicePublicData.js/getOwnerModels().');

  // var promise = new Promise.Promise()
  return new Promise(function (resolve, reject) {
    DevicePublicModel.model
    .find()
    .where('ownerUser', userId)
    .exec(function (err, items) {
      if (err) reject(err)
      else resolve(items)
    })
  });
}

// Get any devicePublicModels where the userId matches the renterUser entry.
function getRenterModels (userId) {
  logr.debug('Entering devicePublicData.js/getRenterModels().');

  return new Promise(function (resolve, reject) {
  // var promise = new Promise.Promise()

    DevicePublicModel.model
    .find()
    .where('renterUser', userId)
    .exec(function (err, items) {
      if (err) reject(err)
      else resolve(items)
    })
  });
  // return promise
}

// This function communicates with Port Control to release the port.
function releasePort (port) {
  logr.debug('Entering devicePublicData.js/releasePort().');

  return new Promise(function (resolve, reject) {
    if ((port === undefined) || (port === '')) return reject('Invalid port');

    request(`http://localhost:3000/api/portcontrol/${port}/remove`, function (error, response, body) {
      // If the request was successfull.
      if (!error && response.statusCode === 200) {
        // debugger;
        console.log(`Port ${port} successfully released from Port Control`);
        resolve(true);

      // Server returned an error.
      } else {
        debugger;

        var msg =
          'Call to Port Control failed. Server returned: ' +
          error.message
        console.error(msg)

        return reject(msg);
      }
    })
  });
}

function createNewMarketListing (device) {
  // Generate an expiration date for the store listing.
  let now = new Date();
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  let temp = now.getTime() + oneMonth;
  let oneMonthFromNow = new Date(temp);

  // logr.debug(`oneMonth: ${oneMonth}`);
  // logr.debug(`now.getTime()+oneMonth = ${temp}, now.getTime() = ${now.getTime()}`);
  // logr.debug(`Setting experation to: ${oneMonthFromNow.toISOString()}, time now is ${new Date()}`);

  // Create new obContract model
  var obj = {
    clientDevice: device._id,
    ownerUser: device.ownerUser,
    renterUser: '',
    price: 30,
    experation: oneMonthFromNow.toISOString(),
    title: device.deviceName,
    description: device.deviceDesc,
    listingUri: '',
    imageHash: '',
    listingState: 'Listed',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }

  return util.submitToMarket(device, obj);
}

/** ** END PROMISE AND UTILITY FUNCTIONS ****/
