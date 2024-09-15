import moment from 'moment-timezone';

export const TIMEZONES = moment.tz.names().map((tz) => ({
  name: tz,
  offset: moment.tz(tz).utcOffset() / 60,
}));