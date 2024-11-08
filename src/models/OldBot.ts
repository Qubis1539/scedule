//   teachers = dragonMMUsers.reduce((acc, DUser) => {
//     if (!DUser.emailAddress) return false;
//     acc[DUser.emailAddress] = {
//       mattermostID: MMUsers[DUser.emailAddress].userId,
//       dragonID: DUser.id,
//       email: DUser.emailAddress,
//       username: MMUsers[DUser.emailAddress].username,
//       first_name: DUser.firstName,
//       last_name: DUser.lastName || "",
//       directId: "",
//       lessons: [],
//     };
//   },{} as Record<string, TeacherData>);
//   for (const DUser of dragonUsers) {
//     teachers[MUser.userId] = {
//       mattermostID: MUser.userId,
//       dragonID: DUser.id,
//       email: MUser.email,
//       username: MUser.username,
//       first_name: DUser.firstName,
//       last_name: DUser.lastName || "",
//       directId: "",
//       lessons: [],
//     };
//     teachers[MUser.userId].lessons = await this.Dragon.getTeacherLessons(
//       DUser.id
//     );

//     let oldTeacher = oldTeachersData.find(
//       (oldTeacher: TeacherData) => oldTeacher.email === DUser.emailAddress
//     );
//     teachers[MUser.userId].directId =
//       oldTeacher?.directId ||
//       (await this.MM.getDirectChannelID(MUser.userId));

// let lessons = await this.Dragon.getTeacherLessons(DUser.id);
// teachers.push({
//   mattermostID: MUser.userId,
//   dragonID: DUser.id,
//   email: MUser.email,
//   username: MUser.username,
//   first_name: DUser.firstName,
//   last_name: DUser.lastName || "",
//   directId,
//   lessons,
// });
//   }

//   return teachers;
// async notifyBirthdaysToday() {
//   const users = await this.todayBirthdays();
//   const text = users.map((user) => {
//     return `${user.name.trim()}`;
//   }).join(', ');
//   if (text) {
//     await this.app.slack.messageWithColor(`:birthdaycake: Сегодня день рождения празднуют: **${text}**!\n:birthdaycake: Не забудь поздравить! :wink:`, MMAttachmentColors.green, true);
//   } else {
//     await this.app.slack.messageWithColor('Сегодня никто не празднует день рождения :wink:', MMAttachmentColors.red, false);
//   }
// }

// async notifyBirthdaysNextWeek() {
//   const birthdayCalendar = await this.nextWeekBirthdays();
//   let message = '';

//   birthdayCalendar.forEach(el => {
//     const userList = el.users.map(user => user.name).join(', ');
//     message += `:birthdaycake: **${el.label}** день рождения празднуют **${userList}**\n`;
//   });

//   if (message !== '') {
//     message += ':birthdaycake: Не забудь поздравить! :wink:';
//     await this.app.slack.messageWithColor(message, MMAttachmentColors.green, true);
//   } else {
//     await this.app.slack.messageWithColor('На этой неделе никто не празднует день рождения :wink:', MMAttachmentColors.red, false);
//   }
// }

// async todayBirthdays(): Promise<user[]> {
//   const today = new Date();
//   const users = await this.app.sheets.getUsersData();

//   return users.filter(user => {
//     const userBirthday = new Date(`${user.month}-${user.day}`);
//     userBirthday.setFullYear(new Date().getFullYear());
//     return isSameDay(userBirthday, today);
//   });
// }

// async nextWeekBirthdays(): Promise<BirthdayData[]> {
//   const users = await this.app.sheets.getUsersData();
//   const today = new Date();

//   const birthdayCalendar: BirthdayData[] = [];

//   for (let i = 1; i <= 7; i++) {
//     const currentDate = addDays(today, i);

//     const usersWithBirthdayOnCurrentDay = users.filter(user => {
//       const userBirthday = new Date(`${user.month} ${user.day}`);
//       userBirthday.setFullYear(currentDate.getFullYear());
//       return isSameDay(userBirthday, currentDate);
//     });

//     if (usersWithBirthdayOnCurrentDay.length > 0) {
//       const sortedUsers = usersWithBirthdayOnCurrentDay.sort((a, b) => {
//         return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
//       });

//       const label = format(currentDate, 'dd.MM');

//       birthdayCalendar.push({
//         date: currentDate,
//         label,
//         users: sortedUsers,
//       });
//     }
//   }
// Read and write data to/from JSON files
