var helpers = require('./helpers'),
    LineByLineReader = require('line-by-line');


var haxfred_irc_habitrpg = function(haxfred) {
  var habitRPG_id = haxfred.config.habitRPG_id || "haxfred";

  if(!haxfred.config.habitRPGUsers) {
    console.log("No config found for Habit RPG users.");
    return false;
  }
  var lr = new LineByLineReader(haxfred.config.habitRPGUsers);
  var users = {};

  lr.on('error', function (err) {
    console.log(err);
  });
  lr.on('line', function (line) {
    var array = line.split(",");
    users[array[0].trim()] = [array[1].trim(),array[2].trim()];
  });

  haxfred.on('irc.upvote', '', function(data, deferred) {

    var recipient = data.recipient,
        habitCreds = helpers.getHabitCredentials(users, recipient);
    
    if (habitCreds) {
      helpers.sendToHabit(habitCreds[0], habitCreds[1], habitRPG_id, true);
    }
    
    deferred.resolve();
  });

};

module.exports = haxfred_irc_habitrpg;
