import { DBScheme, DBTable } from '@brainhub/core-backend/lib/DB.js';
import { DB } from './enums.ts';

declare global {
  // type User = {
  //   id: string;
  //   first_name: string|null;
  //   middle_name: string|null;
  //   last_name: string|null;
  //   nickname: string;
  //   phone_number: string|null;
  //   email_address: string|null;
  //   date_of_birth: Date|null;
  // }

  export type user = {
    name: string;
    day: string;
    month: string;
  }

  export type BirthdayData = {
    date: Date; // Месяц день
    label: string; // День месяц
    users: user[]; // Пользователи, у которых день рождения в date отсортированы по алфавиту
  };

  type DBData = DBScheme<{
    [DB.Users]: DBTable<User>
  }>
}
