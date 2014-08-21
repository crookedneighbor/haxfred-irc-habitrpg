var habitapi = require('habitrpg-api');

var sendToHabit = function(userId, apiKey, id, direction) {
  new habitapi(userId, apiKey).user.updateTaskScore(id, direction, function(response, error){ });
}
