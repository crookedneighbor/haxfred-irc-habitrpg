var Haxfred,
    habitapi = require('habitrpg-api');

var haxfred_irc_habitrpg = function(haxfred) {
  Haxfred = haxfred;

  if(!Haxfred.config.habitRPGUsers) {
    console.log("No config found for Habit RPG users.");
    return false;
  }

  var users = Haxfred.config.habitRPGUsers;

  var sendToHabit = function(userId, apiKey, id, direction) {
    new habitapi(userId, apiKey)
      .user.updateTaskScore(id, direction, function(response, error){ });
  }

  var getHabitCredentials = function(username) {

    var id, api;

    for (var user in users) {
      if(user.toLowerCase() == username.toLowerCase()) {
        id = users[user][0];
        api = users[user][1];
        break;
      }
    }

   if (id && api) { 
     console.log(id);
     console.log(api);
     return [id, api];
   }

   return false;
  }

  haxfred.on('upvote.emit', '', function(data, deferred) {
    var from = data.from,
        habitCreds = getHabitCredentials(from);
    
    if (habitCreds) {
      sendToHabit(habitCreds[0], habitCreds[1], 'haxfred', true);
    }
    
    deferred.resolve();
  });

  haxfred.on('irc.msg', '', function(data, defferred) {
    var from = data.from,
        habitCreds = getHabitCredentials(from);
    
    if (habitCreds) {
      sendToHabit(habitCreds[0], habitCreds[1], 'haxfred', true);
    }
    
    deferred.resolve();
  });
};

module.exports = haxfred_irc_habitrpg;
