import { driver, methodCache, api } from '@rocket.chat/sdk'
//import Promise from "bluebird";

import axios from 'axios'
import * as sdk from 'botpress/sdk'
import _ from 'lodash'
import LRU from 'lru-cache'
import ms from 'ms'

import actions from "./actions";
import outgoing from "./outgoing";

import { Config } from '../config'

import { Clients } from './typings'

const debug = DEBUG('channel-rocketchat')
const debugIncoming = debug.sub('incoming')
const debugOutgoing = debug.sub('outgoing')

const outgoingTypes = ['text', 'image']

const userCache = new LRU({ max: 1000, maxAge: ms('1h') })

export class RocketChatClient {
  private interactive: any
  private logger: sdk.Logger
  private connection : any
  private user : any
  private roomList : any
  private roomsJoined : any
  private subscribed : any
  private connected : boolean

  constructor(private bp: typeof sdk, private botId: string, private config: Config, private router) {
    this.logger = bp.logger.forBot(botId)
    this.connected = false;
  }

  async connect() {

    // split channe string
    function handleChannel(channelList) {
      if (channelList !== undefined) {
        channelList = channelList.replace(/[^\w\,._]/gi, "").toLowerCase();
        if (channelList.match(",")) {
          channelList = channelList.split(",");
        } else if (channelList !== "") {
          channelList = [channelList];
        } else {
          channelList = [];
        }
      }
      return channelList;
    }

    try {
      this.connection =  await driver.connect({
        host: this.config.rocketChatUrl,
        useSsl: this.config.rocketChatUseSSL
      });
      this.user = await driver.login({
        username: this.config.rocketChatBotUser,
        password: this.config.rocketChatBotPassword
      });
      this.roomList = handleChannel(this.config.rocketChatRoom);
      this.roomsJoined = await driver.joinRooms(this.roomList);
      console.log('joined rooms ' + this.config.rocketChatRoom);
      this.subscribed = await driver.subscribeToMessages();
      console.log('subscribed');

       for (const room of this.roomList) {
          const sent = await driver.sendToRoom( this.config.rocketChatBotUser + ' is listening ...',room);
      }
      this.connected = true;
    } catch (error) {
      console.log(error);
    }
  }


/*

  async processMessages(err, message, meta) {


      // If message have .t so it's a system message, so ignore it
      if (message.t === undefined) {

        debugIncoming('Receiving message %o', message)
        const userId = message.u._id;
        const user = await this.bp.users.getOrCreateUser(message.rid, userId);
        debugIncoming('User %o', user)

        // const user = await getOrCreateUser(message);
        await this.bp.events.sendEvent(
              this.bp.IO.Event({
                id: 'text',
                botId: this.botId,
                channel: 'rocketchat',
                direction: 'incoming',
                payload: { message, user_info: user },
                type: "message",
                //createdOn: message.ts.$date,
                preview: message.msg,
                target:this.botId
          })
        )
        
        //debugIncoming('Receiving message %o', message)

      }
   
  }
*/



  async sendToBotpress(rocketChatMessage) {

  }

  // listen to messages  from Rocket.Chat 
  async listen() {
    // Insert new user to db
 
    //const bp = this.bp
    //const botId = this.botId

    const self = this

    const processMessages = async function(err, message, meta) {


      // If message have .t so it's a system message, so ignore it
      if (message.t === undefined) {

        debugIncoming('Receiving message %o', message)

        const userId = message.u._id;
        const user = await self.bp.users.getOrCreateUser(message.rid, userId);
        debugIncoming('User %o', user)

        // const user = await getOrCreateUser(message);
        await self.bp.events.sendEvent(
              self.bp.IO.Event({
                id: 'text',
                botId: self.botId,
                channel: 'rocketchat',
                direction: 'incoming',
                payload: { message:message, user_info: user },
                type: "message",
                //createdOn: message.ts.$date,
                preview: message.msg,
                 target:self.botId
          })
        )
        

      }
    }


    const publicPath = await this.router.getPublicPath()
     this.logger.info(
        `[${this.botId}] Interactive Endpoint URL: ${publicPath.replace('BOT_ID', this.botId)}/bots/${
          this.botId
        }/callback`
      )

     console.log("LISTEN TRIGGERED");
      const options = {
        dm: true,
        livechat: true,
        edited: true
      };

      return driver.respondToMessages(processMessages, options);

  }

  isConnected() {
    return this.connected;
  }

  async disconnect() {
    await driver.disconnect();
  }

  // send message from Botpress to Rocket.Chat
  sendMessage(msg, event) {
    const messageType = event.raw.options.roomType;
    const channelId = event.raw.channelId;
    const username = event.raw.options.user.username;
    if (messageType !== undefined) {
      if (messageType == "c") {
        return driver.sendToRoomId(msg, channelId);
      } else if (messageType == "p") {
        return driver.sendToRoomId(msg, channelId);
      } else if (messageType == "d") {
        return driver.sendDirectToUser(msg, username);
      } else if (messageType == "l") {
        return driver.sendToRoomId(msg, channelId);
      } else {
        console.log("ERROR WHILE SENDING MESSAGE");
      }
    } else {
      console.log("MESSAGE TYPE UNDEFINED");
    }
  }

 sendUpdateText(ts, channelId, text) {
    return Promise.fromCallback(() => {
      driver.sendToRoomId(text, channelId);
    });
  }

  // send messages from Botpress to Rocket.Chat 
  async handleOutgoingEvent(event: sdk.IO.Event, next: sdk.IO.MiddlewareNextCallback) {
   
    if (event.type === 'typing') {
      //await this.rtm.sendTyping(event.threadId || event.target)
      await new Promise(resolve => setTimeout(() => resolve(), 1000))
      return next(undefined, false)
    }

    const messageType = event.type === 'default' ? 'text' : event.type

    if (!_.includes(outgoingTypes, messageType)) {
      return next(new Error('Unsupported event type: ' + event.type))
    }

    var blocks = {};
    const payload = {
      text: event.payload.text,
      channel: event.threadId || event.target
    }

    debugOutgoing('Sending message %o', event.payload.text)
    await this.bp.events.sendEvent(
      this.bp.IO.Event({
        botId: this.botId,
        channel: 'rocketchat',
        direction: 'incoming',
        payload: { ...payload, user_info: this.user },
        type: messageType,
        preview: payload.text,
        target: event.target
        //threadId: threadId && threadId.toString(),
        //target: target && target.toString()
      })
    )

    await this.sendMessage(event.payload.text, event)
 
    next(undefined, false)

  }


}

export async function setupMiddleware(bp: typeof sdk, clients: Clients) {
  bp.events.registerMiddleware({
    description: 'Sends messages to Rocket.Chat',
    direction: 'outgoing',
    handler: outgoingHandler,
    name: 'rocketchat.sendMessages',
    order: 100
  })

  async function outgoingHandler(event: sdk.IO.Event, next: sdk.IO.MiddlewareNextCallback) {
    if (event.channel !== 'rocketchat') {
      return next()
    }

    const client: RocketChatClient = clients[event.botId]
    if (!client) {
      return next()
    }

    return client.handleOutgoingEvent(event, next)
  }

}

