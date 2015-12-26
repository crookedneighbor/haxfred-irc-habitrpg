var HabitApi = require('habitrpg-api')

function sendToHabit (userId, apiKey, id, direction) {
  if (direction !== false) {
    direction = true
  }
  id = id || 'haxfred'

  new HabitApi(userId, apiKey)
    .user.updateTaskScore(id, direction, function (response, error) {})
}

module.exports = {
  sendToHabit: sendToHabit
}
