var habitapi = require('habitrpg-api');

function getHabitCredentials(users, username) {

    var id, api;

    for (var user in users) {
      if(user.toLowerCase() == username.toLowerCase()) {
        id = users[user][0];
        api = users[user][1];
        break;
      }
    }

   if (id && api) { 
     return [id, api];
   }

   return false;
}


function sendToHabit(userId, apiKey, id, direction) {

  new habitapi(userId, apiKey)
    .user.updateTaskScore(id, direction, function(response, error){ });
}

module.exports = {
  getHabitCredentials: getHabitCredentials,
  sendToHabit: sendToHabit
};

