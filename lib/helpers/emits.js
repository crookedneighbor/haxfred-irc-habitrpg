function formatEmits(config, id) {
  var default_id = id || "haxfred",
      default_direction = true,
      default_recipient = "recipient",
      emits = config || { "irc.upvote": {} };

  if (typeof emits != "object") {
    return false;
  }

  // Cycles through emits and assigns default keys
  // if a specific key is absent
  for (var e in emits) {
    emits[e].recipient = emits[e].recipient || default_recipient;
    emits[e].id = emits[e].id || default_id;
    if(emits[e].direction !== false) {
      emits[e].direction = default_direction;
    }
  }

  return emits;
}

module.exports = {
  formatEmits: formatEmits
};

