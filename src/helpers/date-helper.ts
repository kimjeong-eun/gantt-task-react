import { Task, ViewMode } from "../types/public-types";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

const intlDTCache = {};
export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number
) => {
  let newStartDate: Date = tasks[0].start;
  let newEndDate: Date = tasks[0].end;

  for (const task of tasks) {
    const candidateDates = [
      task.start,
      task.end,
      task.baselineStart,
      task.baselineEnd,
    ].filter(Boolean) as Date[];

    for (const date of candidateDates) {
      if (date < newStartDate) newStartDate = date;
      if (date > newEndDate) newEndDate = date;
    }
  }

  // 기존 viewMode 확장 로직 유지
  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 3, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        "day"
      );
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1.5, "month");
      break;
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
  /*    newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 19, "day");*/
      const lastDay = getDaysInMonth(newEndDate.getMonth(), newEndDate.getFullYear());
      newEndDate = new Date(
        newEndDate.getFullYear(),
        newEndDate.getMonth(),
        lastDay,
        23,
        59,
        59,
        999
      );
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 66, "hour");
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 108, "hour");
      break;
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, "hour");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "hour");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1, "day");
      break;
  }

  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate);
  const dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, "month");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    month: "long",
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: "long" | "short" | "narrow" | undefined
) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    weekday: format,
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export function getWeekOfMonthKSIso8601(date: Date): {
  year: number;
  month: number;
  week: number;
} {
  // 주간의 날짜 리스트 생성 (월~일)
  const weekDates: Date[] = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)); // 월요일로 보정

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDates.push(d);
  }

  // 월별 포함 개수 카운팅
  const monthCount = new Map<number, number>();
  for (const d of weekDates) {
    const m = d.getMonth();
    monthCount.set(m, (monthCount.get(m) || 0) + 1);
  }

  // 과반수 차지한 월 구하기
  let maxMonth = date.getMonth();
  let maxCount = 0;
  // @ts-ignore
  for (const [m, c] of monthCount.entries()) {
    if (c > maxCount) {
      maxMonth = m;
      maxCount = c;
    }
  }

  // 해당 maxMonth에 속한 연도 구하기
  const maxMonthYear = weekDates.find(d => d.getMonth() === maxMonth)!.getFullYear();

  // 기준 월의 첫 번째 월요일 찾기
  const firstOfMonth = new Date(maxMonthYear, maxMonth, 1);
  const firstDay = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
  const firstMonday = new Date(firstOfMonth);
  firstMonday.setDate(firstOfMonth.getDate() + (firstDay <= 4 ? -firstDay + 1 : 8 - firstDay));

  const diffDays = Math.floor((startOfWeek.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));

  return {
    year: maxMonthYear,
    month: maxMonth,
    week: Math.floor(diffDays / 7) + 1,
  };
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
