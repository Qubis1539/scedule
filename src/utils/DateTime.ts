import { addHours, startOfWeek, endOfWeek } from "date-fns";

// client.setToken(botAccessToken);
const months = [
  {
    full: "января",
    short: "янв.",
  },
  {
    full: "февраля",
    short: "фев.",
  },
  {
    full: "марта",
    short: "мар.",
  },
  {
    full: "апреля",
    short: "апр.",
  },
  {
    full: "мая",
    short: "мая",
  },
  {
    full: "июня",
    short: "июн.",
  },
  {
    full: "июля",
    short: "июл.",
  },
  {
    full: "августа",
    short: "авг.",
  },
  {
    full: "сентября",
    short: "сен.",
  },
  {
    full: "октября",
    short: "окт.",
  },
  {
    full: "ноября",
    short: "нояб.",
  },
  {
    full: "декабря",
    short: "дек.",
  },
];

export function getMonday() {
  const firstDayOfWeek: Date = addHours(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    3
  );
  // console.log(firstDayOfWeek);

  return firstDayOfWeek;
}
export function getSunday() {
  const lastDayOfWeek: Date = addHours(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    3
  );
  // console.log(lastDayOfWeek);

  return lastDayOfWeek;
}

export function formatDateTime(date: Date, full = false) {
  const today = new Date();

  let hours = String(date.getHours());
  let minutes = String(date.getMinutes());
  let day = String(date.getDate());
  let month = date.getMonth();
  if (Number(hours) < 10) {
    hours = `0${hours}`;
  }
  if (Number(minutes) < 10) {
    minutes = `0${minutes}`;
  }
  if (Number(day) < 10) {
    day = `0${day}`;
  }

  let displaydate = `${day} ${months[month].short}`;
  let displaytime = `${hours}:${minutes}`;
  if (date.getDay() == today.getDay()) {
    displaydate = "Сегодня";
  }

  if (!full) {
    return `${displaytime}`;
  }
  return `${displaydate} ${displaytime}`;
}
