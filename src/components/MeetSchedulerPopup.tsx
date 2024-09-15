import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface MeetSchedulerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  timezones: string[];
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
}

export const MeetSchedulerPopup: React.FC<MeetSchedulerPopupProps> = ({
  isOpen,
  onClose,
  timezones,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0] || 'UTC');

  const handleScheduleMeet = () => {
    // Format the selected date and time to Google Calendar format
    const startDateTime = format(new Date(`${selectedDate}T${selectedStartTime}`), "yyyyMMdd'T'HHmmss");
    const endDateTime = format(new Date(`${selectedDate}T${selectedEndTime}`), "yyyyMMdd'T'HHmmss");

    // Construct Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=New+Meeting&details=Scheduled+from+Multi-Timezone+Dashboard&ctz=${selectedTimezone}&dates=${startDateTime}/${endDateTime}`;
    window.open(googleCalendarUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Google Meet</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Timezone Select */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Timezone</label>
          <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
            <SelectTrigger>
              <SelectValue>{selectedTimezone}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleScheduleMeet}>Schedule Meet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
