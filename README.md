Rocket.Chat - Botpress Readme

## Overview

This is the module integration between Botpress and Rocket.Chat

## Prerequisite

- Set the **externalUrl** field in botpress.config.json

### Configure your bot

Edit **data/bots/YOUR_BOT_ID/config/channel-rocketchat.json** (or create it) and set
- enabled: Set to true
- rocketChatBotUser: [Rocket.Chat Bot User] 
- rocketChatBotPassword: [Rocket.Chat Bot User Password]
- rocketChatUrl : [RocketChat URL ex. http://localhost:3000]   
- rocketChatUseSSL: true / false
- rocketChatRoom: [comma separated chat rooms]


## Quick Start

- Open a terminal in the folder [**modules/rocket-chat**] and type **yarn && yarn build**
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

- Start Botpress: **yarn start**

## Continuous Development

When you make changes to any portion of your module, you need to build it and restart Botpress.
You can type **yarn watch** which will save you some time, since every time you make a change, the source will be compiled immediately. You will only have to restart Botpress.

## Useful documentation to support 

Please check the for more information

- [Rocket.Chat SDK](https://github.com/RocketChat/Rocket.Chat.js.SDK)
- [Botpress SDK](https://botpress.com/reference/)
- [How to create a Botpress module](https://botpress.com/docs/developers/create-module/)
- [Custom module](https://botpress.com/docs/advanced/custom-module)

