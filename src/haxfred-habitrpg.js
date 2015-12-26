import habitHelper from './helpers/habit'
import emitHelper from './helpers/emits'
import userHelper from './helpers/users'
import path from 'path'

let appDir = path.dirname(require.main.filename) + '/'

let haxfred_habitrpg = function (haxfred) {
  // Checks if path to the config file exists
  if (!haxfred.config.habitRPGUsers) {
    console.error('No config found for Habit RPG users.')
    return false
  }

  // Configure emits if default values need to be filled in
  let emits = emitHelper.formatEmits(haxfred.config.habitRPGEmits, haxfred.config.habitRPG_id)

  // Checks if configured emit is an object, if not stop the module
  if (typeof emits !== 'object') {
    console.error('habitRPGEmits must be an object')
    return false
  }

  // Config users into usable object
  let config = require(appDir + haxfred.config.habitRPGUsers)
  let users = userHelper.formatUsers(config)

  // Create listeners for specified emits in config
  for (let e in emits) {
    haxfred.on(e, '', function (data, deferred) {
      let recipient = data[emits[e].recipient].toLowerCase()
      let habitCreds = users[recipient]

      if (habitCreds) {
        habitHelper.sendToHabit(habitCreds.uuid, habitCreds.token, emits[e].id, emits[e].direction)
      }

      deferred.resolve()
    })
  }
}

module.exports = haxfred_habitrpg
