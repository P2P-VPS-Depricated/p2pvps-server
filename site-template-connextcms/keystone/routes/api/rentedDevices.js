/*
  The API handlers in this file are concerned with rented devices and the
  rented-devices.js model.
*/

'use strict';

// Library Dependencies
const keystone = require('keystone')
// const rp = require('request-promise');
const util = require('./lib/util.js');

// Instantiate Keystone Models
const logr = keystone.get('logr'); // Logging system
const RentedDevices = keystone.list('RentedDevices');

// Add deviceId to the list of rented devices.
exports.add = function (req, res) {
  // debugger

  // const deviceId = req.method === 'POST' ? req.body : req.query
  const deviceId = req.params.id

  if (deviceId === undefined || deviceId === '') res.apiError('invalid ID')

  // Retrieve the list of rented devices from the database.
  RentedDevices.model.find(function (err, items) {
    // debugger
    if (err) return res.apiError('database error', err)

    // Handle new database by creating first entry.
    if (items.length === 0) {
      var item = new RentedDevices.model()
      var data = {}

      data.rentedDevices = [deviceId]
      item.getUpdateHandler(req).process(data, function (err) {
        if (err) return res.apiError('error', err)
      })
    } else {
      const rentedDevicesModel = items[0]
      let rentedDevicesList = rentedDevicesModel.get('rentedDevices')

      // Prevent duplicates. Remove the device from the list in case is already exists.
      let newArray = rentedDevicesList.filter(e => e !== deviceId)

      newArray.push(deviceId)
      rentedDevicesModel.set('rentedDevices', newArray)
      rentedDevicesModel.save()
    }

    res.apiResponse({
      success: true
    })
  })
}

// Remove a deviceId from the rented devices list.
exports.remove = function (req, res) {
  try {
    // debugger

    // const deviceId = req.method === 'POST' ? req.body : req.query
    const deviceId = req.params.id

    if (deviceId === undefined || deviceId === '') res.apiError('invalid ID')

    // Retrieve the list of rented devices from the database.
    RentedDevices.model.find(function (err, items) {
      // debugger
      if (err) return res.apiError('database error', err)

      if (items.length === 0) {
        res.apiError('list is empty')
      } else {
        const rentedDevicesModel = items[0]
        let rentedDevicesList = rentedDevicesModel.get('rentedDevices')

        // Remove the deviceId from the array.
        let newArray = rentedDevicesList.filter(i => i !== deviceId)
        // Source: https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value

        rentedDevicesModel.set('rentedDevices', newArray)
        rentedDevicesModel.save()
      }

      res.apiResponse({
        success: true
      })
    })
  } catch (err) {
    debugger;
    return res.apiError('error', err);
  }
}

// Return an array of all the DeviceIDs stored in the rentedDevices model.
exports.list = function (req, res) {
  RentedDevices.model.find(function (err, items) {
    if (err) return res.apiError('database error', err);

    res.apiResponse({
      collection: items
    })
  })
}

// generate an obContract model to renew an existing rental.
exports.renew = async function (req, res) {
  try {
    const deviceId = req.params.id

    if (deviceId === undefined || deviceId === '') res.apiError('invalid ID')

    // Get devicePublicModel.
    let devicePublicModel = await util.getDevicePublicModel(deviceId);

/*
    // Exit if an existing obContract Model ID is already saved to the devicePublicModel.
    console.log(`devicePublicModel.obContract = ${devicePublicModel.obContract}`)
    // if (devicePublicModel.obContract !== '' || devicePublicModel.obContract !== undefined) { return res.apiError('Store listing already exists for this device.'); }
    try {
      let temp = await util.getObContract(devicePublicModel.obContract);
      return res.apiError({
        message: 'Store listing already exists for this device.',
        obContract: temp
      });
    } catch (err) {
      // An error means that the obContract doesn't exist. That's good.
    }
*/

    // Create a new obContract model and store listing
    // let obContractId = await util.submitToMarket(devicePublicModel);
    let obContractId = await createNewMarketListing(devicePublicModel);

    // Update the devicePublicModel with the newly created obContract model GUID.
    devicePublicModel.set('obContract', obContractId);
    await devicePublicModel.save();

    logr.log('API call to renew() succeeded!');

    // Return the Id to the obContract model.
    return res.apiResponse({
      obContractId: obContractId
    });
  } catch (err) {
    debugger;
    logr.error('Error in rentedDevices.js/renew(): ' + err);
    logr.error('Error stringified: ' + JSON.stringify(err, null, 2));
    return res.apiError('error', err)
  }
}

/* BEGIN SUPPORT FUNCITONS */

// This function generates the object necessary to construct an obContract model
// for a renewal listing.
function createNewMarketListing (device) {
  // Generate an expiration date for the store listing.
  let now = new Date()
  // const oneHour = 1000 * 60 * 60;
  const oneHour = 1000 * 60 * 10;
  let oneHourFromNow = new Date(now.getTime() + oneHour)

  logr.debug(`Setting experation to: ${oneHourFromNow.toISOString()}, time now is ${new Date()}`);

    // Create new obContract model
  var obj = {
    clientDevice: device._id,
    ownerUser: device.ownerUser,
    renterUser: '',
    price: 30,
    experation: oneHourFromNow.toISOString(),
    title: 'renewal',
    description: 'This is a renewal listing. ',
    listingUri: '',
    imageHash: '',
    listingState: 'Listed',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }

  return util.submitToMarket(device, obj);
}

/* END SUPPORT FUNCTIONS */
