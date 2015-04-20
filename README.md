haxfred-habitrpg
====================

Adaptor for [HabitRPG](https://habitrpg.com). When Haxfred emits an event that the module is listening for, the module checks if the recipient of the event is listed in the HabitRPGUsers config, and if the user is, Haxfred sends some experience and gold to the user's HabitRPG account.

##Requirements and Set Up

You must have a config file with the user ids of your users and their UUIDs and API Tokens from [HabitRPG](https://habitrpg.com). The file can be called whatever you want, but the path to the file must be determined in Haxfred's config.json with the key name "HabitRPGUsers". If the key is not found, the module will not load. The path of the config is relative to the Haxfred's location.

####Example Json config for HabitRPGUsers
```json
{ 
  "UserID" : {
    "uuid": "UUID-From-Habit-RPG",
    "token": "API-Token-From-Habit-RPG"
  },
  "anotherUserID" : {
    "uuid": "UUID-From-Habit-RPG",
    "token": "API-Token-From-Habit-RPG"
  }
}
```

####Finding your HabitRPG UUID and Token
Both of these can be found by logging into [HabitRPG](https://habitrpg.com), navigating to your [account settings and choosing API](https://habitrpg.com/#/options/settings/api).

##Configurable Items

####Emits
You can configure what emits should trigger the HabitRPG module by adding an object with the key habitRPGEmits to Haxfred's config file. The object should follow this model:

```json
{
  "emit_name": {
    "id": "foo",
    "direction": boolean,
    "recipient": "bar"
  }
}
    
```

The `emit_name` is the emit that the module should listen for. You can add as many emits as you'd like.

The `id` is the id of the habit that will receive the HabitRPG input. If the habit does not already exist, Haxfred will create it the first time it is called. After it is created, you can edit the habit on HabitRPG (including the name) and it will still be linked to Haxfred.

The `direction` is whether or not you want the action to increase exp or gold (true), or decrease health (false). 

The `recipient` is the key in the emit object that corresponds to the user that will receive the HabitRPG event.

Here is an example of a few emits:

```json
{
  "irc.upvote": {
    "id": "upvote",
    "direction": true,
    "recipient": "recipient"
  },
  "slack.upvote": {
    "id": "upvote",
    "direction": true,
    "recipient": "recipient"
  },
  "irc.swearing-detector": {
    "id": "swearing",
    "direction": false,
    "recipient": "swearer"
  }
}
```

##Default Values

####Default Habit ID
You may want multiple emits to use the same id when processing HabitRPG events. If you leave off the `id` in your emit object it will use the default id. 

You can set the default id by adding a HabitRPG_id key to Haxfred's config.json. If no id is specified, it will use "haxfred" as the default ID.

####Default Direction
If no direction is specified in your emit object, a direction of `true` will be used as the value.

####Default Recipient
If no recipient is specified in your emit object, `recipient` will be used as the value.

####Default Emit
If no key is specified for emits, the following will serve as the default emit:

```json
{
  "slack.upvote": {
    "id": "haxfred (or your default_id)",
    "direction": true,
    "recipient": "recipient"
  }
}
```

##Example config.json keys
```json
{
...
  "habitRPGUsers": "./config-files/habitrpgusers.json",
  "habitRPGEmits": {
    "slack.upvote": {
      "direction": true,
      "recipient": "recipient"
    }
  },
  "habitRPG_id": "slack-chat",
...
}
```

##Todo's
* Work on Users module that can pull uuid and token from database, rather than from a file.
* Write more tests for HabitAPI interaction
