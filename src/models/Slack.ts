import got from 'got';
import type { slack } from '../config.js';
import { ResponseError } from './Errors.js';
import { MMAttachmentColors } from '../types/enums.js';

export class Slack {
  constructor(private config: typeof slack) {
    this.config = {...config};
  }

  get url() {
    return this.config.webhook_url;
  }

  async message(text: string, channel?: string) {
    await got.post(this.url, {
      json: {
        channel: channel || this.config.birthday_channel,
        text,
      }
    }).catch(error => {
      throw new ResponseError(error);
    });
  }

  async messageWithColor(text: string, color?: string, isPing?: boolean) {
    await got.post(this.url, {
      json: {
        channel: this.config.birthday_channel,
        text: '',
        attachments: [
          {
            pretext: isPing ? '@channel' : undefined,
            text: `${text}`,
            color: color || MMAttachmentColors.green,
          }
        ]
      }
    }).catch(error => {
      throw new ResponseError(error);
    });
  }
}
