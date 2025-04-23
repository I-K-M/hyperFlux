import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, } from 'react-big-calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enGB } from 'date-fns/locale'

const localizer = dateFnsLocalizer({
  formats: {
    dateFormat: 'dd',
    dayFormat: 'EEEE',
    weekdayFormat: 'EEEEEE',
  },
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(),
{ weekStartsOn: 1 }),
  locales: { 'en-GB': enGB },
  getDay,
})

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const DnDCalendar = withDragAndDrop<CalendarProps<Event>>(Calendar);

type CalendarProps<T extends object> = withDragAndDropProps<T>;

const CalendarComponent: React.FC = () =>  {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Task 1',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 *1000),
    }
  ]);
  const moveEvent = ({ event, start, end }: {event: Event; start: Date; end: Date }) => {
    const updated = events.map((e) =>
    e.id === event.id ? { ...e, start, end } : e
  );
  setEvents(updated);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '80vh', margin: '20px' }}>
        <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='week'
        onEventDrop={moveEvent}
        resizable
        onEventResize= {moveEvent}
        />
      </div>
    </DndProvider>
  )
}

export default CalendarComponent