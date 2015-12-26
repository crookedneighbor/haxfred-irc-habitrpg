function formatEmits (emits, id) {
  var default_id = id || 'haxfred'
  var default_direction = true
  var default_recipient = 'recipient'
  emits = emits || { 'irc.upvote': {} }

  if (typeof emits !== 'object' || Object.getOwnPropertyNames(emits).length === 0) {
    return false
  }

  // Cycles through emits and assigns default keys
  // if a specific key is absent
  for (var e in emits) {
    emits[e].recipient = emits[e].recipient || default_recipient
    emits[e].id = emits[e].id || default_id
    if (emits[e].direction === false || emits[e].direction === 'down') {
      emits[e].direction = false
    } else {
      emits[e].direction = default_direction
    }
  }

  return emits
}

module.exports = {
  formatEmits: formatEmits
}
