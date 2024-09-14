import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X, Moon, Sun, ArrowUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import moment from 'moment-timezone';

const TIMEZONES = moment.tz.names().map((tz) => ({
  name: tz,
  offset: moment.tz(tz).utcOffset() / 60,
}));

const TimeZoneCard = ({ city, dateTime, onRemove, onTimeChange, index, moveCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const localTimeDisplay = dateTime.format('HH:mm');
  const localDateDisplay = dateTime.format('ddd, MMM D, YYYY');

  return (
    <div ref={(node) => drag(drop(node))} className={`opacity-${isDragging ? 0.5 : 1} mb-2`}>
      <Card className="p-3">
        <CardContent className="flex flex-col p-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-2xl font-bold">{localTimeDisplay}</div>
              <div className="text-sm text-gray-500">{city}</div>
              <div className="text-xs text-gray-400">{localDateDisplay}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Slider
            min={0}
            max={23.99}
            step={0.01}
            value={[dateTime.hour() + dateTime.minute() / 60]}
            onValueChange={(value) => onTimeChange(value[0], index)}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
};

const MultiTimezoneDashboard = () => {
  const [locations, setLocations] = useState([
    { city: 'UTC', dateTime: moment.utc() },
    { city: 'Asia/Kolkata', dateTime: moment.tz('Asia/Kolkata') },
  ]);
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateAllTimes = (referenceDateTime, referenceIndex) => {
    setLocations(locations.map((loc, index) => {
      if (index === referenceIndex) {
        return { ...loc, dateTime: referenceDateTime };
      } else {
        const newDateTime = moment(referenceDateTime).tz(loc.city);
        return { ...loc, dateTime: newDateTime };
      }
    }));
  };

  const addLocation = (city) => {
    if (!locations.some((loc) => loc.city === city)) {
      const newDateTime = moment(locations[0].dateTime).tz(city);
      setLocations([{ city, dateTime: newDateTime }, ...locations]);
      setInputValue('');
    }
  };

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleTimeChange = (newTime, index) => {
    const updatedDateTime = moment(locations[index].dateTime)
      .hours(Math.floor(newTime))
      .minutes((newTime % 1) * 60);
    updateAllTimes(updatedDateTime, index);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newDateTime = moment(locations[0].dateTime)
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate());
    updateAllTimes(newDateTime, 0);
  };

  const moveCard = (fromIndex, toIndex) => {
    const updatedLocations = [...locations];
    const [movedCard] = updatedLocations.splice(fromIndex, 1);
    updatedLocations.splice(toIndex, 0, movedCard);
    setLocations(updatedLocations);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && filteredItems.length > 0) {
      addLocation(filteredItems[0].name);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleReverseOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  const displayedLocations = reverseOrder ? [...locations].reverse() : locations;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Multi-Timezone Dashboard</h1>
          <div className="space-x-2">
            <Button onClick={toggleReverseOrder} variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button onClick={toggleDarkMode} variant="outline" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for a timezone..."
                className="border p-2 rounded mb-4 w-full"
              />
              {filteredItems.length > 0 && (
                <ul className="border bg-white dark:bg-gray-800 z-10 absolute w-full mt-1">
                  {filteredItems.map((item) => (
                    <li
                      key={item.name}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => addLocation(item.name)}
                    >
                      {item.name} (GMT{item.offset >= 0 ? '+' : ''}{item.offset})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              {displayedLocations.map((location, index) => (
                <TimeZoneCard
                  key={location.city}
                  index={index}
                  city={location.city}
                  dateTime={location.dateTime}
                  onRemove={removeLocation}
                  onTimeChange={handleTimeChange}
                  moveCard={moveCard}
                />
              ))}
            </div>
          </div>
          <div className="md:w-64">
            <Card>
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MultiTimezoneDashboard;