var helpers = require('./helpers');

var haxfred_irc_habitrpg = function(haxfred) {
  var habitRPG_id = haxfred.config.habitRPG_id || "haxfred";

  if(!haxfred.config.habitRPGUsers) {
    console.log("No config found for Habit RPG users.");
    return false;
  }

  var config = require(haxfred.config.habitRPGUsers);
  
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
