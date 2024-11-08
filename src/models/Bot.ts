import { Dragon } from "../models/Dragon.js";
import { Mattermost } from "./Mattermost.js";
import { Telegram } from "./Telegram.js";
import { DataService } from "../models/DataService.js";
import { formatDateTime } from "../utils/DateTime.js";
// import {addDays, format, isSameDay} from 'date-fns';
import { log, timeStamp } from "console";
import fs from "fs";
import { addHours, setHours, setMinutes, setSeconds } from "date-fns";
// import bodyParser from 'body-parser';

import { NextLesson, TeacherEmail, TeacherData } from "../types/common.js";
import { DragonUserWithEmail } from "../types/dragon.js";
import { ClientData } from "../types/telegram.js";
import path from "path";
import { cwd } from "node:process";
import { sleep } from "@brainhub/core-backend/lib/Utils.js";

import cron from "node-cron";
import { filter } from "lodash";

import { text } from "stream/consumers";

const testUserIDBaratov = "i8rcmhziujr7bez5eexx638zfr";

const notificationTime = {
  long: {
    time: 2 * 60 * 60 * 1000,
    text: "1 час",
  },
  medium: {
    time: 1 * 60 * 60 * 1000,
    text: "2 часа",
  },
  short: {
    time: 15 * 60 * 1000,
    text: "15 минут (!)",
  },
};

const lessonsPath = path.resolve(cwd(), "teachersData", "lessons.json");

const teachersPath = path.resolve(cwd(), "teachersData", "teachers.json");

export class Bot {
  // private db: App["db"];
  //   private mm: App["slack"];
  private MM: Mattermost;
  private Tg: Telegram;
  private channelId = "i8rcmhziujr7bez5eexx638zfr";
  private morningNotificationHour = 6; // 9:00 МСК
  private checkRange = [6, 18]; // 9:00 - 21:00 МСК
  private checkTime = [15, 45];

  private allCronTasks: cron.ScheduledTask[] = [];

  private debugMode = true;

  public Dragon: Dragon;
  public DataService: DataService;

  private teachersDataObtained = false;

  constructor(private app: App) {
    // this.db = app.db;
    // this.mm = app.slack;
    this.MM = new Mattermost(app.config.mattermost);
    this.Dragon = new Dragon(); //"71a7yfsbb3yyx83cuesbqpibee"
    this.Tg = new Telegram(this);
    this.DataService = new DataService();
    this.debugMode = app.config.dev.debug;
    log("Debug mode:", this.debugMode);
  }

  // ---------------------------------

  async testFunc() {
    this.Dragon.changeTokens();
  }
  // time functions

  private formatLessonChangeMessage(
    newLesson?: NextLesson,
    oldLesson?: NextLesson
  ): string {
    const canceledLessons = "**Урок отменен:**";
    const addedLessons = "**Добавлен новый урок сегодня:**";
    const changedLessons = "**Изменение времени урока:**";
    if (oldLesson && !newLesson) {
      return (
        canceledLessons +
        `\n${oldLesson.shortId} — ${oldLesson.studentFullName}\n` +
        `~~${formatDateTime(new Date(oldLesson.startAt))} — ` +
        `${formatDateTime(new Date(oldLesson.endAt))}~~\n\n`
      );
    } else if (!oldLesson && newLesson) {
      return (
        addedLessons +
        `\n${newLesson.shortId} — ${newLesson.studentFullName}\n` +
        `${formatDateTime(new Date(newLesson.startAt))} — ` +
        `${formatDateTime(new Date(newLesson.endAt))}\n\n`
      );
    } else if (oldLesson && newLesson) {
      // Изменение урока
      return (
        changedLessons +
        `\n${newLesson.shortId} — ${newLesson.studentFullName}\n` +
        `~~${formatDateTime(new Date(oldLesson.startAt))} — ` +
        `${formatDateTime(new Date(oldLesson.endAt))}~~\n` +
        `${formatDateTime(new Date(newLesson.startAt))} — ` +
        `${formatDateTime(new Date(newLesson.endAt))}\n\n`
      );
    }
    return "";
  }

  async checkTeachersLessonsChanges() {
    log("method checkTeachersLessonsChanges called");

    const teachersData: Record<string, TeacherData> =
      await this.DataService.readData(teachersPath);
    const newLessonsData: Record<string, NextLesson[]> =
      await this.createLessonsList();
    const oldLessonsData: Record<string, NextLesson[]> =
      await this.DataService.readData(lessonsPath);

    const relevantLessons: Record<
      string,
      { newLesson?: NextLesson; oldLesson?: NextLesson }[]
    > = {};
    log("method checkTeachersLessonsChanges keep working");

    for (const teacher in teachersData) {
      if (
        this.debugMode &&
        teachersData[teacher].directId !== testUserIDBaratov
      ) {
        continue;
      }
      const newLessons = newLessonsData[teacher] || [];
      const oldLessons = oldLessonsData[teacher] || [];

      const lessonsMap = new Map<
        string,
        { newLesson?: NextLesson; oldLesson?: NextLesson }
      >();

      newLessons.forEach((newLesson) => {
        lessonsMap.set(newLesson.id, { newLesson });
      });

      oldLessons.forEach((oldLesson) => {
        if (lessonsMap.has(oldLesson.id)) {
          lessonsMap.get(oldLesson.id)!.oldLesson = oldLesson;
        } else {
          lessonsMap.set(oldLesson.id, { oldLesson });
        }
      });

      lessonsMap.forEach((value, key) => {
        if (
          JSON.stringify(value.newLesson) !== JSON.stringify(value.oldLesson)
        ) {
          if (!relevantLessons[teacher]) {
            relevantLessons[teacher] = [];
          }
          relevantLessons[teacher].push(value);
        }
      });
    }

    for (const teacher in teachersData) {
      if (!relevantLessons[teacher]) continue;
      const channelID = teachersData[teacher].directId;
      if (this.debugMode && channelID !== testUserIDBaratov) {
        continue;
      }
      let message = "";
      relevantLessons[teacher].forEach(({ newLesson, oldLesson }) => {
        message += this.formatLessonChangeMessage(newLesson, oldLesson) + "\n";
      });
      if (!message) continue;
      message = `:warning: ${teachersData[teacher].first_name}!\n${message}`;
      message = message.toString();
      log(message);
      await this.MM.postMessage(message, channelID, this.debugMode);
    }

    await this.DataService.writeData(newLessonsData, lessonsPath);
  }
  async createLessonsList(): Promise<Record<string, NextLesson[]>> {
    let teachers: Record<string, TeacherData> = await this.DataService.readData(
      teachersPath
    );
    let allLessons: Record<string, NextLesson[]> = {};
    try {
      for (let teacher in teachers) {
        let teacherLessons = await this.Dragon.getTeacherLessons(
          teachers[teacher].dragonID
        );
        allLessons[teacher] = teacherLessons;
        sleep(500);
      }
      return allLessons;
    } catch (error) {
      log("Error while creating lessons list: ", error);
      return {};
    }
  }
  async createTeacherList(): Promise<Record<string, TeacherData>> {
    try {
      let mattermostUsers = await this.MM.getUsers();
      let dragonUsers = await this.Dragon.getTaechers();
      let teachers: Record<string, TeacherData> = {};
      // log("mattermostUsers: ", mattermostUsers);
      // log("dragonUsers: ", dragonUsers);
      let MMUsers = {};
      mattermostUsers.forEach((user: TeacherEmail) => {
        MMUsers[user.email] = user;
      });

      let dragonMMUsers: DragonUserWithEmail[] = dragonUsers.filter((DUser) => {
        if (!DUser.emailAddress) return false;
        return !!MMUsers[DUser.emailAddress];
      }) as DragonUserWithEmail[]; // !
      for (let DUser of dragonMMUsers) {
        if (!DUser.emailAddress) return {};

        let dirID = await this.MM.getDirectChannelID(
          MMUsers[DUser.emailAddress].userId
        );
        teachers[DUser.emailAddress] = {
          mattermostID: MMUsers[DUser.emailAddress].userId,
          dragonID: DUser.id,
          email: DUser.emailAddress,
          username: MMUsers[DUser.emailAddress].username,
          first_name: DUser.firstName,
          last_name: DUser.lastName || "",
          directId: dirID || "",
        };
        // log("teachers: ", teachers);
      }
      // log("teachers: ", teachers);
      log("teachers end");
      return teachers;
    } catch (error) {
      log("Error while creating teachers list: ", error);
      return {};
    }
  }
  async saveTeachersData() {
    const teachers: Record<string, TeacherData> =
      await this.createTeacherList();
    // log("+");
    log("teachers: ", Object.keys(teachers).length);
    if (Object.keys(teachers).length)
      await this.DataService.writeData(teachers, teachersPath);
  }

  async saveLessonsData() {
    const lessons: Record<string, NextLesson[]> =
      await this.createLessonsList();
    log("lessons: ", Object.keys(lessons).length);
    if (lessons)
      await this.DataService.writeData(
        lessons,
        path.resolve(cwd(), "teachersData", "lessons.json")
      );
  }
  async morningLessonNotification() {
    const teachersData: Record<string, TeacherData> =
      await this.DataService.readData(teachersPath);
    const lessonsData: Record<string, NextLesson[]> =
      await this.DataService.readData(lessonsPath);

    for (const teacher in teachersData) {
      if (
        this.debugMode &&
        teachersData[teacher].directId !== testUserIDBaratov
      ) {
        continue;
      }
      // Сортируем уроки по времени начала
      lessonsData[teacher].sort((a: NextLesson, b: NextLesson) => {
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      });

      let lessonsMessage = "";
      lessonsData[teacher].forEach((lesson: NextLesson) => {
        lessonsMessage += `${formatDateTime(
          new Date(lesson.startAt),
          false
        )} — ${formatDateTime(new Date(lesson.endAt), false)}\n${
          lesson.shortId
        } — ${lesson.studentFullName}\n\n`;
      });
      if (lessonsMessage === "") {
        this.MM.postMessage(
          "На сегодня уроков нет.",
          teachersData[teacher].directId,
          this.debugMode
        );
      } else {
        this.MM.postMessage(
          `:goodmorning: Привет, ${teachersData[teacher].first_name}!\n\nТвое расписание на сегодня:\n${lessonsMessage}`,
          teachersData[teacher].directId,
          this.debugMode
        );
      }
    }
  }
  async prepareLessonsToPairs() {
    const lessonsData: Record<string, NextLesson[]> =
      await this.DataService.readData(lessonsPath);
    // Используем flat для создания одного массива всех уроков и filter для выбора нужных
    return Object.values(lessonsData).flat();
  }

  async getStudentLessonsByStudentID(
    lessons: NextLesson[] = [],
    studentID: string
  ) {
    return lessons.filter((lesson) => lesson.studentId === studentID);
  }
  async notifyLessonsTG() {
    // const teachersData: Record<string, TeacherData> =
    //   await this.DataService.readData(teachersPath);
    // const lessonsData: Record<string, NextLesson[]> =
    //   await this.DataService.readData(lessonsPath);
    const clients: Record<string, ClientData> = await this.Tg.getClients();
    const timeNow = new Date().valueOf();
    const parsedLessons = await this.prepareLessonsToPairs();

    for (const clientID in clients) {
      if (!clients[clientID].active) continue;

      const lessons = await this.getStudentLessonsByStudentID(
        parsedLessons,
        clients[clientID].id
      );
      if (lessons.length === 0) continue;

      for (const lesson of lessons) {
        let msg = "";
        for (let timeRange in notificationTime) {
          if (
            clients[clientID].notification[timeRange] &&
            timeNow - new Date(lesson.startAt).valueOf() >=
              notificationTime[timeRange].time - 15 * 60 * 1000 &&
            timeNow - new Date(lesson.startAt).valueOf() <=
              notificationTime[timeRange].time * 60000
          ) {
            msg += `Через ${notificationTime[timeRange].text} преподаватель будет ждать вашего ребенка.\n`;
          }
        }

        await this.Tg.sendMessage(
          `${msg}\n\nНачало занятия в ${formatDateTime(
            new Date(lesson.startAt),
            false
          )}`
        );
      }
    }
  }
  async notifyClosestLessons(notifyTime = 15) {
    const teachersData: Record<string, TeacherData> =
      await this.DataService.readData(teachersPath);
    const lessonsData: Record<string, NextLesson[]> =
      await this.DataService.readData(lessonsPath);
    for (const teacher in teachersData) {
      if (
        this.debugMode &&
        teachersData[teacher].directId !== testUserIDBaratov
      ) {
        continue;
      }
      for (const lesson of lessonsData[teacher]) {
        if (
          new Date(lesson.startAt).valueOf() - new Date().valueOf() > 0 &&
          new Date(lesson.startAt).valueOf() - new Date().valueOf() <=
            notifyTime * 60000 // за 15 минут
        ) {
          await this.MM.postMessage(
            `:book: Урок ${
              lesson.shortId
            } начнется через ${notifyTime} минут (начало: ${formatDateTime(
              new Date(lesson.startAt),
              false
            )})`,
            teachersData[teacher].directId,
            this.debugMode
          );
        }
      }
    }
  }
  async getAndSaveAllData() {
    log("saving teachers data...");
    await this.saveTeachersData();
    log("saving lessons data...");
    await this.saveLessonsData();
    log("done");
    this.teachersDataObtained = true;
  }
  async setupScheduledChecks() {
    this.allCronTasks.push(
      cron.schedule(
        "30 8 * * *",
        async () => {
          log("getting and saving all data...");
          await this.getAndSaveAllData();
          return;
        },
        {
          timezone: "Europe/Moscow", // Установите нужный вам часовой пояс
        }
      )
    );
    this.allCronTasks.push(
      cron.schedule(
        "0 9 * * *",
        async () => {
          log("morning lesson notification...");
          await this.morningLessonNotification();
          return;
        },
        {
          timezone: "Europe/Moscow", // Установите нужный вам часовой пояс
        }
      )
    );
    this.allCronTasks.push(
      cron.schedule(
        "0 */15 9-21 * * *",
        async () => {
          log("checking teachers lessons changes and notify...");
          if (!this.teachersDataObtained) {
            await this.getAndSaveAllData();
          }
          await this.checkTeachersLessonsChanges();
          await this.notifyClosestLessons();
          await this.notifyLessonsTG();
          return;
        },
        {
          timezone: "Europe/Moscow", // Установите нужный вам часовой пояс
        }
      )
    );
    for (const task of this.allCronTasks) {
      task.start();
    }
    // log(this.allCronTasks);
  }

  async start() {
    log("starting bot...");
    if (this.debugMode) {
      // await this.MM.postMessageToGeneral("Бот запущен в дебаг режиме");
    }
    // await this.getAndSaveAllData();
    // this.teachersDataObtained = true;
    // await this.setupScheduledChecks();
    await this.Dragon.getClassromLessons();
  }
}
