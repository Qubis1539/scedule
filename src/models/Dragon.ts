import { dragon } from "../config.js";
import fetch from "node-fetch";
import type { RequestInit, RequestInfo } from "node-fetch";
import {
  DragonClassRoomResp,
  DragonUser,
  DragonTeacher,
  DragonTeachersResp,
  ClassRoom,
  AuthTokens,
} from "../types/dragon.js";
import { TeacherEmail, NextLesson } from "../types/common.js";
import { getMonday, getSunday } from "../utils/DateTime.js";
import { filter } from "lodash";
import { log } from "console";
import { throws } from "assert";
import { sleep } from "@brainhub/core-backend/lib/Utils.js";
import { tr } from "date-fns/locale";
// import { delay } from "node:timers/promises";
// client.setToken(botAccessToken);

export class Dragon {
  private tokens = {
    accessToken: "",
    refreshToken: "",
  };
  private loginData = {
    login: "baratov@brainhub.pro",
    password: "QtheD9BK",
  };
  private isAuth = false;
  private maxAttempts = 11;
  constructor() {
    // this.config = { ...config };
    // this.loginByPassword("baratov@brainhub.pro", "QtheD9BK");
    log("Getting new tokens");
    this.refreshAccessTokens();
  }

  async dragonRequest<T>(
    url: RequestInfo | URL,
    fetchOptions: RequestInit = {},
    attempts = 0
  ): Promise<T> {
    const defaultFetchOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    };
    const dragonResp = await fetch(url, {
      ...defaultFetchOptions,
      ...fetchOptions,
    });

    if (!dragonResp.ok) {
      if (attempts >= this.maxAttempts) {
        throw new Error("Max attempts reached", {
          cause: dragonResp,
        });
      }
      if (dragonResp.status === 401) {
        log("Token expired. Refreshing...");
        await this.refreshAccessTokens();
        return await this.dragonRequest<T>(url, fetchOptions, attempts + 1);
      }
      throw new Error("request failed", {
        cause: dragonResp,
      });
    }
    return await (dragonResp.json() as T);
  }
  private async loginByEmail(): Promise<AuthTokens> {
    log("Trying to logging in to get new tokens...");
    let dragonResp = await this.dragonRequest<AuthTokens>(
      "https://dragon.brainhub.pro/api/v1/auth/sign-in/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authPoint: "dragon",
          emailAddress: this.loginData.login,
          password: this.loginData.password,
        }),
      }
    );
    return dragonResp;
  }
  async refreshAccessTokens(): Promise<string> {
    let dragonResp: AuthTokens;
    try {
      dragonResp = await this.dragonRequest<AuthTokens>(
        `https://dragon.brainhub.pro/api/v1/auth/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: this.tokens.refreshToken,
          }),
        }
      );
    } catch (e) {
      log("Can't refresh tokens");
      if (e.cause.status !== 500 && e.cause.status !== 400) throw e;
      dragonResp = await this.loginByEmail();
    }
    this.tokens = dragonResp;

    log("tokens obtained");
    return this.tokens.accessToken;
  }
  changeTokens() {
    this.tokens.accessToken = "itewfugyh13d2rci1xvtyj9rjb2tobn";
  }
  async getTaechers(): Promise<DragonUser[]> {
    const dragonTeachersData = await this.dragonRequest<DragonTeachersResp>(
      `https://dragon.brainhub.pro/api/v1/teachers`
    );

    let teachers: DragonUser[] = [];
    // log(someData);

    dragonTeachersData.items.forEach((teacher: DragonTeacher) => {
      const teacherData = teacher.user;
      if (
        teacherData.emailAddress?.includes("@brainhub.pro") &&
        teacherData.isBlocked === false
      ) {
        teachers.push(teacherData);
      }
    });
    return teachers;
  }

  // add method to get cassroom by classroom id

  async getClassromLessons() {
    const teacherID = "usr_638CODKouziU2y";
    const dragonLessonsResp = await this.dragonRequest<DragonClassRoomResp>(
      `https://dragon.brainhub.pro/api/v1/classroom-lessons?limit=250&startAtTo=${getSunday().toISOString()}&endAtFrom=${getMonday().toISOString()}&teacherIds=${[
        teacherID,
      ]}&withArchived=false`
    );
    log("+++++++++++++++++++++++++++++++");
    log(dragonLessonsResp);
    log("+++++++++++++++++++++++++++++++");
    log(dragonLessonsResp?.items);
    log("+++++++++++++++++++++++++++++++");
  }

  async getTeacherLessons(
    teacherID: string,
    attempts = 0
  ): Promise<NextLesson[]> {
    const dragonLessonsResp = await this.dragonRequest<DragonClassRoomResp>(
      `https://dragon.brainhub.pro/api/v3/classrooms?limit=250&startAtTo=${getSunday().toISOString()}&endAtFrom=${getMonday().toISOString()}&teacherIds=${teacherID}&withArchived=false`
    );

    // log(someData);
    let nextLessons: NextLesson[] = [];
    for (let i = 0; i < dragonLessonsResp?.items?.length; i++) {
      const group: ClassRoom = dragonLessonsResp?.items[i];
      let teacherName: string = "";
      let teacherId: string = "";
      let TeacherEmail: string = "";

      group.teachers.forEach((teacher: any) => {
        if (teacher.isCurrent) {
          teacherName = teacher.teacher?.user?.firstName || "";
          teacherId = teacher.teacher?.user?.id || "";
          TeacherEmail = teacher.teacher?.user?.emailAddress || "";
        }
      });
      if (group?.status == "IN_PROGRESS" && teacherId == teacherID) {
        for (let j = 0; j < group.lessons.length; j++) {
          const lesson = group.lessons[j];

          if (
            // lesson.status == "UPCOMING" &&
            new Date(lesson.startAt).getDate() == new Date().getDate() &&
            new Date(lesson.startAt).getMonth() == new Date().getMonth()
          ) {
            nextLessons.push({
              id: lesson.id,
              shortId: group.shortId,
              teacher: teacherName,
              teacherEmail: TeacherEmail,
              teacherId: teacherId,
              studentFullName:
                group.students?.[0]?.student?.user?.fullName || "Странно, да?",
              studentId:
                group.students?.[0]?.student?.user?.nickname ||
                "Бежим в поддержку",
              startAt: lesson.startAt,
              endAt: lesson.endAt,
            });
            break;
          }
        }
      }
    }
    return nextLessons;
  }
  async getUser(userID: string) {
    const dragonResp = this.dragonRequest<DragonUser>(
      `https://dragon.brainhub.pro/api/v1/users/${userID}`
    );
    log(dragonResp);
    return dragonResp;
  }
  // async getTeachersLessons(teacherID: any): Promise<any[]> {
  //   const someURL = `https://dragon.brainhub.pro/api/v1/classrooms?limit=250&startAtTo=${getSunday().toISOString()}&endAtFrom=${getMonday().toISOString()}&teacherIds=${teacherID}&withArchived=false`;
  //   const someResponse = await fetch(someURL, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${thistokens.accessToken}`,
  //     },
  //   });
  //   const someData = (await someResponse.json()) as DragonClassRoomResp;
  //   log(someData);
  //   return someData?.items;
  // }
}
