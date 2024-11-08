import { Controller, Handler } from "./models/Controller.js";

export class API extends Controller {
  get routes() {
    const info = () => ({
      code: 200,
      body: {
        service: this.manager.config.app_name,
        instance: this.manager.config.app_instance,
        version: this.manager.config.version,
      },
    });

    return {
      "/": {
        GET: info,
      },
      "/every-hour-check": {
        GET: EveryHourCheck,
      },
      "/save-teachers-data": {
        GET: saveTeachersData,
      },
      "/save-lessons-data": {
        GET: saveLessonsData,
      },
      "/check-lessons-changes": {
        GET: CheckLessonsChanges,
      },
      "/morning-lesson-notification": {
        GET: MorningLessonNotification,
      },
      "/notify-closest-lessons": {
        GET: NotifyClosestLessons,
      },
      "/t-f": {
        GET: TestFunc,
      },
      // "/notify-birthdays-next-week": {
      //   GET: NotifyBirthdaysNextWeek,
      // },
    };
  }
}

export class EveryHourCheck extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "everyHourCheck";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.setupScheduledChecks();
      return { success: true, message: "Hello" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class saveTeachersData extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "SaveTeachersData";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.saveTeachersData();
      return { success: true, message: "Zeus says: Hello" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class saveLessonsData extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "SaveLessonsData";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.saveLessonsData();
      return { success: true, message: "Aid says: Hello" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class CheckLessonsChanges extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "CheckLessonsChanges";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.checkTeachersLessonsChanges();
      return { success: true, message: "Aid says: Cheking" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class MorningLessonNotification extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "morningLessonNotification";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.morningLessonNotification();
      return { success: true, message: "Aid says: Good Morning" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class TestFunc extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "testFunc";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.testFunc();
      return { success: true, message: "Aid says: testFunc" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
export class NotifyClosestLessons extends Handler<{
  success: boolean;
  message?: string;
}> {
  static get handler() {
    return "notifyClosestLessons";
  }
  static get logger() {
    return "API";
  }

  async payload() {
    try {
      await this.manager.bot.notifyClosestLessons();
      return { success: true, message: "Aid says: notifyClosestLessons" };
    } catch (error) {
      if (error.message === "no_user") {
        return this.reject({}, "notFound");
      }
      if (error.message === "no_user_nickname") {
        return this.reject(
          { error: "user_has_no_slack_connection" },
          "badRequest"
        );
      }
      throw error;
    }
  }
}
// export class NotifyBirthdaysNextWeek extends Handler<{ success: boolean }> {
//   static get handler() {
//     return "notifyBirthdaysToday";
//   }
//   static get logger() {
//     return "API";
//   }

//   async payload() {
//     try {
//       await this.manager.bot.notifyBirthdaysNextWeek();
//       return { success: true };
//     } catch (error) {
//       if (error.message === "no_user") {
//         return this.reject({}, "notFound");
//       }
//       if (error.message === "no_user_nickname") {
//         return this.reject(
//           { error: "user_has_no_slack_connection" },
//           "badRequest"
//         );
//       }
//       throw error;
//     }
//   }
// }

// export class GetBirthdays extends Handler<user[]> {
//   static get handler() {
//     return "getBirthdays";
//   }
//   static get logger() {
//     return "API";
//   }

//   async payload() {
//     return await this.manager.bot.todayBirthdays();
//   }
// }
