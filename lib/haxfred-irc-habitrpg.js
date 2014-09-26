var helpers = require('./helpers');
var path = require('path');
var appDir = path.dirname(require.main.filename) + "/";

var haxfred_irc_habitrpg = function(haxfred) {
  if(!haxfred.config.habitRPGUsers) {
    console.error("No config found for Habit RPG users.");
    return false;
  }

  // Defaults if no config is found
  var default_id = haxfred.config.habitRPG_id || "haxfred",
      default_direction = true,
      default_recipient = "recipient",
      default_emit = { "irc.upvote": {} };

  var emits = haxfred.config.habitRPGEmits || default_emit;

  if(typeof emits == "object") {
    for (var e in emits) {
      emits[e].recipient = emits[e].recipient || default_recipient;
      emits[e].id = emits[e].id || default_id;
      emits[e].direction = emits[e].direction || default_direction;
    }
  } else {
    console.error("habitRPGEmits must be an object");
    return false;
  }

  var config = require(appDir + haxfred.config.habitRPGUsers);

  // Transform config into users with lowercase keys
  var users = {};
  var key, keys = Object.keys(config);
  var n = keys.length;
  while (n--) {
    key = keys[n];
    users[key.toLowerCase()] = config[key];
  }

  // Create listeners for specified emits in config
  for (var e in emits) {
    haxfred.on(e, '', function(data, deferred) {

      var recipient = data[emits[e].recipient].toLowerCase(),
          habitCreds = users[recipient];
      
      if (habitCreds) {
        helpers.sendToHabit(habitCreds.uuid, habitCreds.token, emits[e].id, emits[e].direction);
      }
      
      deferred.resolve();
    });
  }

};

module.exports = haxfred_irc_habitrpg;
