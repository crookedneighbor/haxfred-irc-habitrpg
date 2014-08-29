var helpers = require('./helpers');

var haxfred_irc_habitrpg = function(haxfred) {

  if(!haxfred.config.habitRPGUsers) {
    console.log("No config found for Habit RPG users.");
    return false;
  }

  var users = haxfred.config.habitRPGUsers;

  haxfred.on('irc.upvote', '', function(data, deferred) {

    var recipient = data.recipient,
        habitCreds = helpers.getHabitCredentials(users, recipient);
    
    if (habitCreds) {
      helpers.sendToHabit(habitCreds[0], habitCreds[1], 'haxfred', true);
    }
    
    deferred.resolve();
  });

};

module.exports = haxfred_irc_habitrpg;
