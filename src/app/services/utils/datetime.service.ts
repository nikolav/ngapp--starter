import { Injectable } from '@angular/core';

import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  dayjs = dayjs;
  // constructor() {}
}
