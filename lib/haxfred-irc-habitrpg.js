var helpers = require('./helpers');
var path = require('path');
var appDir = path.dirname(require.main.filename) + "/";
console.log(appDir);

var haxfred_irc_habitrpg = function(haxfred) {
  if(!haxfred.config.habitRPGUsers) {
    console.log("No config found for Habit RPG users.");
    return false;
  }

  var habitRPG_id = haxfred.config.habitRPG_id || "haxfred";

  var config = require(appDir + haxfred.config.habitRPGUsers);
  
  // Transform config into users with lowercase keys
  var users = {};
  var key, keys = Object.keys(config);
  var n = keys.length;
  while (n--) {
    key = keys[n];
    users[key.toLowerCase()] = config[key];
  }

  // Detect Upvote emits
  haxfred.on('irc.upvote', '', function(data, deferred) {

    var recipient = data.recipient.toLowerCase(),
        habitCreds = users[recipient];
    
    if (habitCreds) {
      helpers.sendToHabit(habitCreds.uuid, habitCreds.token, habitRPG_id, true);
    }
    
    deferred.resolve();
  });

};

module.exports = haxfred_irc_habitrpg;
