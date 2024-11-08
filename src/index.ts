import type Config from "./config.js";
import { Server } from "@brainhub/core-backend";
import { Manager as CoreManager } from "@brainhub/core-backend/lib/Manager.js";
import { LogSender, Logger } from "@brainhub/core-backend";
import { API } from "./api.js";
import { Slack } from "./models/Slack.js";
import { Bot } from "./models/Bot.js";
// import {Sheets} from './models/Sheets.js';

declare global {
  interface App extends CoreManager {
    // db: TypedDB<DBData>;
    // mq: MQ;
    config: typeof Config;
    bot: Bot;
    slack: Slack;
    // sheets: Sheets
  }
}

export default class Main implements App {
  private logSender: LogSender;
  private log: Logger;
  name: string;
  // db: TypedDB<DBData>;
  // mq: MQ;
  api: API;
  server: Server;
  bot: Bot;
  slack: Slack;
  // sheets: Sheets;
  // consumer: Consumer;

  constructor(public config: typeof Config) {
    this.name = this._setName();
    this._initLogs();

    // this.db = new TypedDB<DBData>(this.config.db, this.name);
    // this.mq = new MQ(this.config.mq, this);

    this.bot = new Bot(this);
    this.slack = new Slack(this.config.slack);

    // this.sheets = new Sheets(this.config.sheets);

    this.api = new API(this.config.api, this);
    // this.consumer = new Consumer(this);

    this.server = new Server(this.config.server, (req, data) =>
      this.api.request(req, data)
    );

    this.server.start();
    this.bot.start();
  }

  _setName() {
    let name = this.config.app_name;
    if (this.config.app_instance) name += `.${this.config.app_instance}`;
    return name;
  }

  _initLogs() {
    this.logSender = new LogSender(this.config.logging, this);
    this.log = new Logger("App", null, this.logSender);
    global.logSender = this.logSender;

    process.on("uncaughtException", (error) => {
      this.log.catch("unhandled_exception", error);
    });
    process.on("unhandledRejection", (error: Error) => {
      this.log.catch("unhandled_rejection", error);
    });
  }
}
