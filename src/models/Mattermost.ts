import MM from "@mattermost/client";
import { mattermost } from "../config.js";
import fetch from "node-fetch";
import { MMUserData } from "../types/mattermost.js";
import { TeacherEmail } from "../types/common.js";
import { PostMetadata, PostType, Post } from "@mattermost/types/posts";
import { debug, log } from "console";

// client.setToken(botAccessToken);

export class Mattermost {
  private client: MM.Client4;
  private botID: string;
  constructor(private config: typeof mattermost) {
    this.config = { ...config };
    this.botID = this.config.botID;
    this.client = new MM.Client4();
    this.client.setUrl("https://mattermost.brainhub.pro");
    this.client.setToken(this.config.accessToken);
  }
  async getDirectChannelID(teacherId: string): Promise<string> {
    const resp = await this.client.createDirectChannel([this.botID, teacherId]);
    return resp.id;
  }
  async getUsers(
    page: number = 0,
    mattermostUsersIn: TeacherEmail[] = []
  ): Promise<TeacherEmail[]> {
    let mattermostUsers = [...mattermostUsersIn];
    try {
      const MMUsersDataResponse = await fetch(
        `https://mattermost.brainhub.pro/api/v4/users?per_page=200&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: "Bearer " + this.config.accessToken,
          },
        }
      );
      const MMUsersData: MMUserData[] =
        (await MMUsersDataResponse.json()) as MMUserData[]; // !

      if (MMUsersData.length === 0) return mattermostUsers;

      MMUsersData.forEach((user) => {
        mattermostUsers.push({
          email: user.email,
          userId: user.id,
          username: user.username,
        });
      });
      return await this.getUsers(page + 1, mattermostUsers);
    } catch (error) {
      log("Error while getting mattermost users: ", error);
    }
    return mattermostUsers;
  }

  async postMessage(
    message: string,
    channel_id: string = "i8rcmhziujr7bez5eexx638zfr", // default channel BaratovMichael
    debug = false
  ) {
    try {
      // const channel = await client.createDirectChannel([channel_id]);
      const post = {
        channel_id: channel_id,
        message,
      } as Post;
      let serverChannels = await this.client.createPost(post);
      if (debug) {
        await this.postMessageToGeneral(message);
      }
      // log(serverChannels);
    } catch (error) {
      log("Error while sending mattermost message: ", error);
    }
  }
  async postMessageToGeneral(message: string) {
    // channel_id: "ipcn3u1ssjybjmd53336f9gjmh",
    // upc78cwktj8d9fzkzsue7fcsar Паша
    await this.postMessage(message, "ipcn3u1ssjybjmd53336f9gjmh");
  }
}
