// type ConsumerEvents = {
//   'demo_bot': UserMessage;
//   'demo_bot.birthday': UserBirthday;
//   'telegram': TelegramMessage;
// };

// export class Consumer {
//   private mq: App['mq'];

//   constructor(private app: App) {
//     this.app = app;
//     this.mq = app.mq;

//     this.mq.consume<ConsumerEvents>('birthday_bot', async ({ data, key }, defer) => {
//       try {
//         if (key === 'demo_bot') {
//           await this.app.bot.message(data.message);
//         } else if (key === 'demo_bot.birthday') {
//           await this.app.bot.happyBirthday(data.user_id);
//         } else if (key === 'telegram') {
//           await this.app.bot.telegram(data);
//         }
//         defer.resolve();
//       } catch (e) {
//         defer.reject(false);
//       }
//     }, {
//       prefetch: 100,
//     }, {}, [
//       { source: 'webhooks', pattern: 'demo_bot.#' },
//       { source: 'webhooks', pattern: 'telegram' },
//     ]);
//   }
// }
