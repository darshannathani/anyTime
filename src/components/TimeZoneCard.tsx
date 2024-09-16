import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X , GripVertical } from 'lucide-react';
import moment from 'moment-timezone';


interface TimeZoneCardProps {
  city: string;
  dateTime: moment.Moment;
  onRemove: (index: number) => void;
  onTimeChange: (newTime: number, index: number) => void;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
}



export const TimeZoneCard: React.FC<TimeZoneCardProps> = ({ city, dateTime, onRemove, onTimeChange, index, moveCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const generateTimeLabels = () => {
    const labels = [];
    for (let i = 0; i < 24; i++) {
      let label = i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`;
      labels.push(label);
      i++;
    }
    labels.push('12 AM');
    return labels
};

  const localTimeDisplay = dateTime.format('HH:mm');
  const localDateDisplay = dateTime.format('ddd, MMM D, YYYY');

  return (
<div ref={(node) => drag(drop(node))} className={`opacity-${isDragging ? 0.5 : 1} mb-2`}>
  <Card className="p-3">
    <CardContent className="flex flex-col p-0">
      <div className="flex justify-between items-center mb-2">
        {/* Row containing drag icon, time, city, and date */}
        <div className="flex items-center space-x-4">
          {/* Draggable Icon */}
          <GripVertical className="h-5 w-5 text-gray-500 cursor-move" />

          <div className="text-2xl font-semibold">{localTimeDisplay}</div>
          <div className="text-lg font-medium text-gray-600">{city}</div>
          <div className="text-sm text-gray-500">{localDateDisplay}</div>
        </div>

        {/* Remove Button */}
        <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Scale Slider */}
      <div className="flex justify-between text-xs text-gray-500 mb-1">
            {generateTimeLabels().map((label, idx) => (
              <span key={idx} className="text-center">{label}</span>
            ))}
          </div>

        {/* Slider */}
        <Slider
          min={0}
          max={23.99}
          step={0.01}
          value={[dateTime.hour() + dateTime.minute() / 60]}
          onValueChange={(value) => onTimeChange(value[0], index)}
          className="w-full"
          style={{ background: 'linear-gradient(to right, #5d6dff 0%, #ffc31f 35%,  #ff6200 70%,#5d6dff 100%)' }}
        />
    </CardContent>
  </Card>
</div>
  );
};