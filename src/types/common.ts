export type NextLesson = {
  id: string;
  shortId: string;
  teacher: string;
  teacherId: string;
  teacherEmail: string;
  studentFullName: string;
  studentId: string;
  startAt: string;
  endAt: string;
};
export type TeacherData = {
  mattermostID: string;
  dragonID: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  directId: string;
};
export type TeacherEmail = {
  email: string;
  userId: string;
  username: string;
};
