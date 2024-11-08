import TgBot from "node-telegram-bot-api";
import { Message, KeyboardButton } from "node-telegram-bot-api";
import { DataService } from "../models/DataService.js";
import path from "path";
import { cwd } from "node:process";
import { log } from "console";
import { ClientData } from "../types/telegram.js";
import { Bot } from "../models/Bot.js";
import { text } from "stream/consumers";
const clientsPath = path.resolve(cwd(), "teachersData", "clients.json");
const token = "6680907774:AAEVEyMNZrKCuhqcNKN97FgeYWRd7hk_OKE";

const notificationTime = {
  long: {
    time: 2 * 60 * 60 * 1000,
    text: "За 2ч",
  },
  medium: {
    time: 1 * 60 * 60 * 1000,
    text: "За 1ч",
  },
  short: {
    time: 15 * 60 * 1000,
    text: "За 15мин",
  },
};

const notificationTimeKeys = Object.keys(notificationTime);

export class Telegram {
  private bot: TgBot;
  private dataService: DataService;
  private clients: Record<string, ClientData> = {};
  private mainBot: Bot;
  private keyboards: Record<string, KeyboardButton[][]>;
  constructor(mainBot: Bot) {
    this.bot = new TgBot(token, { polling: true });
    this.bot.setMyCommands([
      { command: "/start", description: "Запустить бота" },
    ]);

    this.keyboards = {
      startKeyboard: [
        [{ text: "Уведомления о занятиях" }, { text: "Моё расписание" }],
      ],
      notificationKeyboard: [
        [{ text: "За 2ч" }, { text: "За 1ч" }, { text: "За 15мин" }],
        [{ text: "Назад" }],
      ],
    };
    this.dataService = new DataService();
    this.mainBot = mainBot;
    this.initializeBot();
  }
  public async getClients(): Promise<Record<string, ClientData>> {
    return (await this.dataService.readData(clientsPath)) || {};
  }
  private async addNewClient(
    chatID: string,
    firstName: string,
    userName: string
  ) {
    this.clients[chatID] = {
      id: chatID,
      firstName: firstName,
      username: userName,
      email: "",
      phone: "",
      dragonID: "",
      active: false,
      notification: {
        long: false,
        medium: false,
        short: false,
      },
      stages: {
        email: false,
        dragonID: false,
      },
    };

    await this.saveClientsData();
  }

  private async saveClientsData(): Promise<void> {
    await this.dataService.writeData(this.clients, clientsPath);
  }
  private async handleStartCommand(chatId: string, msg: Message) {
    let clients = await this.getClients();
    if (!clients[chatId]) {
      this.addNewClient(
        chatId,
        msg.from?.first_name || "",
        msg.from?.username || ""
      );
      // answer += "Здравствуйте, я BrainHub бот\n";
      await this.sendMessage("Здравствуйте, я BrainHub бот", chatId);
      await this.sendMessage(
        "Для начала работы, мне необходимо найти вас в нашей базе данных, пожалуйста введите ваш ID код, который вам дал наш менеджер",
        chatId
      );
      return;
    }
  }

  private async handleInactiveClient(chatId: string, msgText: string) {
    if (!this.clients[chatId].stages.dragonID) {
      if (/^usr_[a-zA-Z0-9]{14}$/.test(msgText)) {
        // dragonID example usr_638CODKouziU2y
        let user = await this.mainBot.Dragon.getUser(msgText);
        if (user) {
          this.clients[chatId].dragonID = msgText;
          this.clients[chatId].stages.dragonID = true;
          this.clients[chatId].active = true;
          await this.sendMessage(
            "Ваш ID успешно добавлен",
            chatId,
            this.keyboards.startKeyboard
          );
          await this.saveClientsData();
        }
      } else {
        await this.sendMessage(
          "Код не соответствует формату, проверьте правильность написания ID или обратиться в службу поддержки",
          chatId
        );
      }
    }
  }

  private async handleActiveClient(chatId: string, msgText: string) {
    if (msgText === "Уведомления о занятиях") {
      await this.sendMessage(
        "Ваши уведомления",
        chatId,
        this.setEmojiStatusForClientNotify(chatId)
      );
    } else if (msgText.includes("2ч")) {
      this.clients[chatId].notification.long =
        !this.clients[chatId].notification.long;
      await this.sendMessage(
        "Ваши уведомления",
        chatId,
        this.setEmojiStatusForClientNotify(chatId)
      );
      await this.saveClientsData();
    } else if (msgText.includes("1ч")) {
      this.clients[chatId].notification.medium =
        !this.clients[chatId].notification.medium;
      await this.sendMessage(
        "Ваши уведомления",
        chatId,
        this.setEmojiStatusForClientNotify(chatId)
      );
      await this.saveClientsData();
    } else if (msgText.includes("15мин")) {
      this.clients[chatId].notification.short =
        !this.clients[chatId].notification.short;
      await this.sendMessage(
        "Ваши уведомления",
        chatId,
        this.setEmojiStatusForClientNotify(chatId)
      );
      await this.saveClientsData();
    } else if (msgText === "Моё расписание") {
      await this.sendMessage(
        "Ваше расписание",
        chatId,
        this.keyboards.startKeyboard
      );
    } else {
      await this.sendMessage(
        "Выберите из предложенных вариантов",
        chatId,
        this.keyboards.startKeyboard
      );
    }
  }
  private setEmojiStatusForClientNotify(clientID: string) {
    const newKeyboard = [...this.keyboards.notificationKeyboard];
    // long short medium

    notificationTimeKeys.forEach((v, i) => {
      newKeyboard[0][i].text =
        (this.clients[clientID].notification[v] ? "✅" : "❌") +
        notificationTime[v].text;
    });
    return newKeyboard;
  }
  // private async
  async sendMessage(
    message: string,
    chatId: string = "-4246177899",
    reqkeyboard?: KeyboardButton[][],
    delMsg = false
  ) {
    // -4246177899 856046675
    // default chad Id for send messages to local test channel
    // if (!keyboard) {
    if (!reqkeyboard) {
      await this.bot.sendMessage(chatId, message);
      return;
    }
    let msg = await this.bot.sendMessage(chatId, message, {
      reply_markup: {
        keyboard: reqkeyboard,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    if (delMsg) {
      await this.bot.deleteMessage(chatId, msg.message_id);
    }
  }

  private async initializeBot() {
    this.clients = await this.getClients();

    this.bot.on("message", async (msg: Message) => {
      // log(msg);
      const messageId = msg.message_id;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (text === "/start") {
        await this.handleStartCommand(chatId, msg);
        return;
      }
      if (!this.clients[chatId].active) {
        await this.handleInactiveClient(chatId, text);
        return;
      }

      await this.handleActiveClient(chatId, text);
      await this.bot.deleteMessage(chatId, messageId);
    });
  }
}
