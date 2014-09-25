var habitapi = require('habitrpg-api');

function sendToHabit(userId, apiKey, id, direction) {

  direction = direction || true;
  id = id || "haxfred";

  new habitapi(userId, apiKey)
    .user.updateTaskScore(id, direction, function(response, error){ });
}

module.exports = {
  sendToHabit: sendToHabit
};

