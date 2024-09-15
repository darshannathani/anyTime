import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ArrowUpDown, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { TimeZoneCard } from './TimeZoneCard';
import { useTimezones } from '../hooks/useTimezones';
import { useDarkMode } from '../hooks/useDarkMode';
import { MeetSchedulerPopup } from './MeetSchedulerPopup';

const MultiTimezoneDashboard: React.FC = () => {
  const {
    locations,
    selectedDate,
    inputValue,
    filteredItems,
    reverseOrder,
    addLocation,
    removeLocation,  // Ensure removeLocation works
    handleTimeChange,
    handleDateChange,
    moveCard,
    setInputValue,
    toggleReverseOrder,
  } = useTimezones();

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  const handleOpenPopup = (startTime: string, endTime: string) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setIsPopupOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && filteredItems.length > 0) {
      addLocation(filteredItems[0].name);
    }
  };

  const displayedLocations = reverseOrder ? [...locations].reverse() : locations;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src="logo.png" alt="Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Multi-Timezone Dashboard</h1>
          </div>
          <div className="space-x-2">
            <Button onClick={() => handleOpenPopup('10:00', '11:00')} variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Meet
            </Button>
            {/* Button to toggle the reverse order */}
            <Button onClick={toggleReverseOrder} variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            {/* Button to toggle dark mode */}
            <Button onClick={toggleDarkMode} variant="outline" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Side: Search bar and Timezone cards in the same column */}
          <div className="flex-grow">
            <div className="flex flex-col space-y-4">
              {/* Search input */}
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for a timezone..."
                  className="border p-2 rounded w-full dark:bg-gray-800"
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

              {/* Timezone cards */}
              <div className="space-y-2 w-full">
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
          </div>

          {/* Right Side: Calendar (on extreme right, covering height of search bar + timezone cards) */}
          <div className="md:w-64 flex-shrink-0">
            <Card className="">
              <CardContent className="p-1">
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


        {/* Meet Scheduler Popup */}
        <MeetSchedulerPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          timezones={locations.map((loc) => loc.city)}
          selectedDate={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
        />
      </div>
    </DndProvider>
  );
};

export default MultiTimezoneDashboard;
