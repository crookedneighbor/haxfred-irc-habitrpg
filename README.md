haxfred-irc-habitrpg
====================

IRC adaptor for [HabitRPG](https://habitrpg.com) (to be used in conjunction with [haxfred-irc-upvote adaptor](https://github.com/haxiom/haxfred-irc-upvote)). When Haxfred emits an upvote, the module checks if the recipient of the upvote is listed in the HabitRPGUsers config, and if the user is, Haxfred sends some experience and gold to the user's HabitRPG account.

##Requirements and Set Up
This should be installed in conjunction with [haxfred-irc](https://github.com/haxiom/haxfred-irc) and [haxfred-irc-upvote adaptor](https://github.com/haxiom/haxfred-irc-upvote).

You must have a config file with the usernames of your irc users and their UUIDs and API Tokens from [HabitRPG](https://habitrpg.com). The file can be called whatever you want, but the path to the file must be determined in Haxfred's config.json with the key name "HabitRPGUsers". If the key is not found, the module will not load. The path of the config is relative to the Haxfred's location.

####Example Json config for HabitRPGUsers
```
{ 
  "ircUserName" : {
    "uuid": "UUID-From-Habit-RPG",
    "token": "API-Token-From-Habit-RPG"
  },
  "anotherUserName" : {
    "uuid": "UUID-From-Habit-RPG",
    "token": "API-Token-From-Habit-RPG"
  }
}
```

####Finding your HabitRPG UUID and Token
Both of these can be found by logging into [HabitRPG](https://habitrpg.com), navigating to your [account settings and choosing API](https://habitrpg.com/#/options/settings/api).

####Setting the name of the habit
You can set the name of the habit that gets added to your user's accounts by adding a HabitRPG_id key to Haxfred's config.json. If no id is specified, it will use the id "haxfred".

####Example config.json keys
```
{
...
	"habitRPGUsers": "./config-files/habitrpgusers.json",
	"habitRPG_id": "upvote",
...
}

```

##Todo's
* Make kinds of emits completely configurable
* Work on Users module that can pull uuid and token from database, rather than from a file.
