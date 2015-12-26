function formatUsers (config) {
  // Transform config into users with lowercase keys
  var users = {}
  var key
  var keys = Object.keys(config)
  var n = keys.length
  while (n--) {
    key = keys[n]
    if (config[key].uuid && config[key].token) {
      users[key.toLowerCase()] = config[key]
    } else {
      console.error(key + ' is missing a uuid/token, or is not formatted correctly')
    }
  }
  return users
}

module.exports = {
  formatUsers: formatUsers
}
