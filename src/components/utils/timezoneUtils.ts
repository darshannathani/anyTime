import moment from 'moment-timezone';

export const TIMEZONES = moment.tz.names().map((tz) => ({
  name: tz,
  offset: moment.tz(tz).utcOffset() / 60,
}));

export const updateAllTimes = (locations, referenceDateTime, referenceIndex) => {
  return locations.map((loc, index) => {
    if (index === referenceIndex) {
      return { ...loc, dateTime: referenceDateTime };
    } else {
      const newDateTime = moment(referenceDateTime).tz(loc.city);
      return { ...loc, dateTime: newDateTime };
    }
  });
};