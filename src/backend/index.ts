import * as sdk from 'botpress/sdk'
import { Config } from '../config'
import { setupMiddleware, RocketChatClient } from './client'
import { Clients } from './typings'

let router
const clients: Clients = {}

// This is called when server is started, usually to set up the database
const onServerStarted = async (bp: typeof sdk) => {  
    // from lack module
    await setupMiddleware(bp, clients)
}

// At this point, you would likely setup the API route of your module.
const onServerReady = async (bp: typeof sdk) => {

  // create a router to the bot
  router = bp.http.createRouterForBot('channel-rocketchat', {
    checkAuthentication: false,
    enableJsonBodyParser: false,
    enableUrlEncoderBodyParser: false
  })
}

// Every time a bot is created (or enabled), this method will be called with the bot id
const onBotMount = async (bp: typeof sdk, botId: string) => {
  const config = (await bp.config.getModuleConfigForBot('channel-rocketchat', botId, true)) as Config
  
  // if channel is enabled in bot config create Rocket.Chat client
  if (config.enabled) {
    const bot = new RocketChatClient(bp, botId, config, router)
    await bot.connect()
    await bot.listen()
    clients[botId] = bot
  }
  
}

// This is called every time a bot is deleted (or disabled)
const onBotUnmount = async (bp: typeof sdk, botId: string) => {

  const client = clients[botId]
  if (!client) {
    return
  }

  await client.disconnect()
  delete clients[botId]  
}


const entryPoint: sdk.ModuleEntryPoint = {
  onServerStarted,
  onServerReady,
  onBotMount,
  onBotUnmount,
  definition: {
    // This must match the name of your module's folder, and the name in package.json
    name: 'channel-rocketchat',
    /**
     * When menuIcon is set to `custom`, you need to provide an icon. It must be at that location: `/assets/icon.png`
     * Otherwise, use Material icons name: https://material.io/tools/icons/?style=baseline
     */
    menuIcon: 'flag',
    // This is the name of your module which will be displayed in the sidebar
    menuText: 'Rocket.Chat Module',
    // When set to `true`, the name and icon of your module won't be displayed in the sidebar
    noInterface: true,
    // The full name is used in other places, for example when displaying bot templates
    fullName: 'Rocket.Chat Module',
    // Not used anywhere, but should be a link to your website or module repository
    homepage: 'https://www.met.it'
  }
}

export default entryPoint
