var habitHelper = require('./helpers/habit')
var emitHelper = require('./helpers/emits')
var userHelper = require('./helpers/users')
var path = require('path')
var appDir = path.dirname(require.main.filename) + '/'

var haxfred_habitrpg = function (haxfred) {
  // Checks if path to the config file exists
  if (!haxfred.config.habitRPGUsers) {
    console.error('No config found for Habit RPG users.')
    return false
  }

  // Configure emits if default values need to be filled in
  var emits = emitHelper.formatEmits(haxfred.config.habitRPGEmits, haxfred.config.habitRPG_id)

  // Checks if configured emit is an object, if not stop the module
  if (typeof emits !== 'object') {
    console.error('habitRPGEmits must be an object')
    return false
  }

  // Config users into usable object
  var config = require(appDir + haxfred.config.habitRPGUsers)
  var users = userHelper.formatUsers(config)

  // Create listeners for specified emits in config
  for (var e in emits) {
    haxfred.on(e, '', function (data, deferred) {
      var recipient = data[emits[e].recipient].toLowerCase()
      var habitCreds = users[recipient]

      if (habitCreds) {
        habitHelper.sendToHabit(habitCreds.uuid, habitCreds.token, emits[e].id, emits[e].direction)
      }

      deferred.resolve()
    })
  }
}

module.exports = haxfred_habitrpg
