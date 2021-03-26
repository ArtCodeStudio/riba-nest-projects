import { HttpService } from "@ribajs/core";
import { defaultCache, hashCode } from "./cache";
import type { CalendarComponent } from "ical";

export class CalendarService {
  protected static instance: CalendarService;
  protected url = "/api/calendar";

  protected constructor() {
    /** protected */
  }

  public static getInstance() {
    if (CalendarService.instance) {
      return CalendarService.instance;
    }
    CalendarService.instance = new CalendarService();
    return CalendarService.instance;
  }

  async get(calendarKey: string, expiresIn: number | string = "5 mins") {
    const cacheKey = hashCode(this.url + calendarKey);
    return defaultCache.resolve<CalendarComponent[]>(
      cacheKey,
      async () => {
        const events:
          | CalendarComponent[]
          | void = await HttpService.getJSON("/api/calendar", { calendarKey });
        return events || [];
      },
      expiresIn
    );
  }
}
