
/*
  TODO:
  -Add persistDevicePublicModel() to persist changes to devicePublicModel to the server.
  -Add persistObContractModel() to persist changes to the obContractModel to the server.
  -Add persistDevicePrivateModel() to persist changes to devicePrivateModel to the server.
*/

export default {

  // Get the user ID (GUID). Will present a modal to the user if they are not logged in, but
  // they should never see that.
  getId (context) {
    $.get('/api/getUserId', '', function (data) {
      context.commit('SET_USER_ID', data.userId)
    })
    // If the user is not logged in, reflect it in the Vuex state.
    .fail(function (jqxhr, textStatus, error) {
      if (jqxhr.responseJSON.detail === 'Could not retrieve user ID. You must be logged in to use this API.') {
        context.commit('SET_USER_ID', 'Not Logged In')

        // Display a modal to the user
        var modal = {
          show: true,
          title: 'Please log in',
          body: 'You are not logged in. Please log in below:',
          button1Text: 'Close',
          button1Func: function () { $('.appModal').modal('hide') },
          button1Show: true,
          button2Text: '',
          button2Func: null,
          button2Show: false,
          showLoginForm: true
        }
        context.commit('UPDATE_MODAL', modal)
      }
    })
  },

  // getDeviceData retrieves device data from the server and populates the Vuex store
  // with the data.
  getDeviceData (context) {
    var ownedDevices = []

    // Get *public* device data associated with this user.
    $.get('/api/devicePublicData/listById', '', function (publicData) {
      var devicePublicData = publicData.collection

      // Get the matching *private* device data.
      $.get('/api/devicePrivateData/listById', '', function (privateData) {
        var devicePrivateData = privateData.collection
        var rentedDevices = []

        // Loop through all the private models and match them up with public models.
        for (var i = 0; i < devicePrivateData.length; i++) {
          var publicId = devicePrivateData[i].publicData // The GUID pointing back to the public record.

          // Loop through the public models until the match is found.
          for (var j = 0; j < devicePublicData.length; j++) {
            if (publicId === devicePublicData[j]._id) { // Public and private records match.
              // Merge the private data properties into the public data object
              devicePublicData[j].serverSSHPort = devicePrivateData[i].serverSSHPort
              devicePublicData[j].deviceUserName = devicePrivateData[i].deviceUserName
              devicePublicData[j].devicePassword = devicePrivateData[i].devicePassword

              // Get the 'money owed' for this device.
              if (devicePrivateData[i].moneyOwed) {
                devicePublicData[j].moneyOwed = devicePrivateData[i].moneyOwed;
              } else {
                devicePublicData[j].moneyOwed = 0.0;
              }

              var userId = context.state.userInfo.GUID // The user ID for the current user.

              // Owner
              if (devicePublicData[j].ownerUser === userId) {
                // debugger
                // Add the combined device object to the store object.
                ownedDevices.push(devicePublicData[j])
              }

              // Renter
              if (devicePublicData[j].renterUser === userId) {
                // Add the combined device object to the store object.
                rentedDevices.push(devicePublicData[j])
              }

              // Break out of the loop.
              break
            }
          }
        }

        // Add data to the store.
        context.commit('SET_OWNED_DEVICES', ownedDevices)
        context.commit('SET_RENTED_DEVICES', rentedDevices)
      })
      .fail(function (jqxhr, textStatus, error) {
        console.error('API call to /api/devicePrivateData/listById unsuccessful. Error: ' + jqxhr.responseJSON.detail)
      })
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error('API call to /api/devicePublicData/listById unsuccessful. Error: ' + jqxhr.responseJSON.detail)
    })

    // TODO download obContractModel data if it's filled out.
    .then(() => {
      // debugger

      for (var i = 0; i < ownedDevices.length; i++) {
        if (ownedDevices[i].obContract) {
          // debugger
          $.get('/api/devicePublicData/listById', '').then(data => {
            // debugger
          })
        }
      }
    })
  },

  // This function deletes a devicePublicModel and devicePrivate model from the server.
  // TODO Add the ability to delete obContractModel associated with devicePublicModel.
  deleteDevice (context, deviceId) {
    // debugger

    // Delete the public data model
    $.get('/api/devicePublicData/' + deviceId + '/remove', '', function (data) {
      // debugger

      // Error handling
      if (!data.success) {
        console.error('Unable to delete device with ID ' + deviceId)
        return
      }

      // TODO delete the devicePrivateModel.

      // Refresh the Store.
      if (context.state.userInfo.GUID !== 'Not Logged In') {
        context.dispatch('getDeviceData')
      }
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error('API call to /api/devicePublicData/' + deviceId + '/remove unsuccessful. Error: ' + jqxhr.responseJSON.detail)
    })
  },

  // Persist data to the PublicDeviceModel on the server
  persistPublicDeviceModel (context, devicePublicModel) {
    // debugger

    var obContract = ''
    if (devicePublicModel.obContract) obContract = devicePublicModel.obContract

    var renterUser = ''
    if (devicePublicModel.renterUser) obContract = devicePublicModel.renterUser

    // Create a publicDeviceModel from data in the store.
    var tmpModel = {
      ownerUser: devicePublicModel.ownerUser,
      renterUser: renterUser,
      privateData: devicePublicModel.privateData,
      obContract: obContract,
      // rentStartDate: '',
      // rentStopDate: '',
      deviceName: devicePublicModel.deviceName,
      deviceDesc: devicePublicModel.deviceDesc
      // rentHourlyRate: '',
      // subdomain: '',
      // httpPort: '',
      // sshPort: '',
      // memory: testModel.memory,
      // diskSpace: testModel.diskSpace,
      // processor: testModel.processor,
      // internetSpeed: testModel.internetSpeed
      // checkinTimeStamp: testModel.checkinTimeStamp
    }

    // JSON.stringify(tmpModel, null, 2)

    // Upload the data to the server.
    $.post('/api/devicePublicData/' + devicePublicModel._id + '/update', tmpModel, function (publicData) {
      // debugger
      console.log(`devicePublidModel ${publicData.collection._id} updated.`)
    })
    .fail(function (jqxhr, textStatus, error) {
      // debugger
      console.error('API call to /api/devicePublicData/' + devicePublicModel._id + '/update unsuccessful. Error: ' + jqxhr.responseJSON.detail, error)
      throw error
    })
  }
}
