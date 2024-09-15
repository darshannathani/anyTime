import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { TIMEZONES } from '@/constants/timezones';

interface Location {
  city: string;
  dateTime: moment.Moment;
}

export const useTimezones = () => {
  const [locations, setLocations] = useState<Location[]>([
    { city: 'UTC', dateTime: moment.utc() },
    { city: 'Asia/Kolkata', dateTime: moment.tz('Asia/Kolkata') },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<{ name: string; offset: number; }[]>([]);
  const [reverseOrder, setReverseOrder] = useState<boolean>(false);

  useEffect(() => {
    if (inputValue) {
      const filtered = TIMEZONES.filter((tz) =>
        tz.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [inputValue]);

  const updateAllTimes = (referenceDateTime: moment.Moment, referenceIndex: number): void => {
    setLocations(locations.map((loc: Location, index: number) => {
      if (index === referenceIndex) {
        return { ...loc, dateTime: referenceDateTime };
      } else {
        const newDateTime = moment(referenceDateTime).tz(loc.city);
        return { ...loc, dateTime: newDateTime };
      }
    }));
  };

  const addLocation = (city: string): void => {
    if (!locations.some((loc) => loc.city === city)) {
      const newDateTime = moment(locations[0].dateTime).tz(city);
      setLocations([{ city, dateTime: newDateTime }, ...locations]);
      setInputValue('');
    }
  };

  const removeLocation = (index: number): void => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleTimeChange = (newTime: number, index: number): void => {
    const updatedDateTime = moment(locations[index].dateTime)
      .hours(Math.floor(newTime))
      .minutes((newTime % 1) * 60);
    updateAllTimes(updatedDateTime, index);
  };

  const handleDateChange = (date: Date | undefined): void => {
    if (date) {
      setSelectedDate(date);
      const newDateTime = moment(locations[0].dateTime)
        .year(date.getFullYear())
        .month(date.getMonth())
        .date(date.getDate());
      updateAllTimes(newDateTime, 0);
    }
  };

  const moveCard = (fromIndex: number, toIndex: number): void => {
    const updatedLocations: Location[] = [...locations];
    const [movedCard] = updatedLocations.splice(fromIndex, 1);
    updatedLocations.splice(toIndex, 0, movedCard);
    setLocations(updatedLocations);
  };

  const toggleReverseOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  return {
    locations,
    selectedDate,
    inputValue,
    filteredItems,
    reverseOrder,
    addLocation,
    removeLocation,
    handleTimeChange,
    handleDateChange,
    moveCard,
    setInputValue,
    toggleReverseOrder,
  };
};