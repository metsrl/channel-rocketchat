Rocket.Chat - Botpress Readme

## Overview

This is the module integration between Botpress and Rocket.Chat

## Prerequisite

- Set the **externalUrl** field in botpress.config.json

## Actual limitations

- Tested so far with Botpress text responses only (no tests with more complex responses like cards, carousels or buttons)
- THIS THE SOURCE CODE AND SHOUD BE COMPILE AND PACKAGED WITH YARN BUILD && YARN PACKAGE COMMANDS. Actually there is an issue while we're trying to package the module with the yarn package command (under Linux-like environments like Ubuntu or MacOSX, it work under Windows OS). 

## Quick Start

- Edit your **botpress.config.json** and add the module definition so it will be loaded:

```js
{
  ...
  "modules": [
    ...
    {
      "location": "MODULES_ROOT/channel-rocketchat",
      "enabled": true
    },
}
```

### Configure your bot
 
Edit **data/bots/YOUR_BOT_ID/config/channel-rocketchat.json** (or create it) and set
- enabled: Set to true
- rocketChatBotUser: [Rocket.Chat Bot User] 
- rocketChatBotPassword: [Rocket.Chat Bot User Password]
- rocketChatUrl : [RocketChat URL ex. http://localhost:3000 or https://chat.example.com]   
- rocketChatUseSSL: true / false
- rocketChatRoom: [comma separated chat rooms to subscribe to]

```
{
  "$schema": "../../../assets/modules/channel-rocketchat/config.schema.json",
  "enabled": true,
  "rocketChatUrl": "https://chat.example.com",
  "rocketChatUseSSL": true,  
  "rocketChatBotUser": "rocketChatBotUsername",
  "rocketChatBotPassword": "rocketChatBotUserPassword",
  "rocketChatRoom": "GENERAL",
  "scope": ""
}
```



- Restart Botpress


## Useful documentation

Please check the following links for more information

- [Rocket.Chat SDK](https://github.com/RocketChat/Rocket.Chat.js.SDK)
- [Botpress SDK](https://botpress.com/reference/)
- [How to create a Botpress module](https://botpress.com/docs/developers/create-module/)
- [Custom module](https://botpress.com/docs/advanced/custom-module)
