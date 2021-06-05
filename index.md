Rocket.Chat - Botpress Readme

## Overview

This is the module integration between Botpress and Rocket.Chat

## Prerequisite

- Set the **externalUrl** field in botpress.config.json

## Actual limitations

- Tested so far with Botpress text responses only (no tests with more complex responses like cards, carousels or buttons)
- THIS IS THE MODULE SOURCE CODE AND SHOUD BE COMPILE AND PACKAGED WITH YARN BUILD && YARN PACKAGE COMMANDS. 
- There is an issue while we try to package the module (yarn package) under Linux-like environments (Ubuntu or MacOSX), but it works under Windows OS. 

## Setting up a development environment
### Manually
    -  download [BP source code](https://github.com/botpress/botpress) and unzip it in a folder of your choice (_root BP folder_)
    -  download and unzip channel-rocketchat code under folder _module/channel-rocketchat_ of _root BP folder_
    -  from the _root BP folder_ launch 
        - yarn
        - yarn build
        - yarn package
   - if the yarn package carry out successfully you can move the package _channel-rocketchat.tgz_ found under _out/binaries/modules_ under **modules** folder into the BP binary installation (or try to launch BP from _out/binaries/_)
### Compiling on Docker

```bash
git clone https://github.com/metsrl/channel-rocketchat.git
cd channel-rocketchat
docker build -t channel --no-cache .
docker run -v "$(pwd)":/out --rm channel bash -c "cp /bp/out/binaries/modules/channel-rocketchat.tgz /out/"
echo && echo "There you go:" && ls -lh channel-rocketchat.tgz
```
Then, put the *channel-rocketchat.tgz* inside your production "<BP_ROOT>/modules" and restart you BP. 

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
