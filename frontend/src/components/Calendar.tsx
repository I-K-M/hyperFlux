import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, } from 'react-big-calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enGB } from 'date-fns/locale'
import Button from './Button'
import TimeTracker, { CalendarEvent as TrackerEvent } from './TimeTracker'

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
});
export interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  project?: string;
}
type SlotInfo = {
  start: Date;
  end: Date;
};

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [slotInfo, setSlotInfo] = useState<SlotInfo | null >(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventColor, setEventColor] = useState<string>('');
  const [eventTag, setEventTag] = useState<string>('');

   useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tasks', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const loaded = data.map((t: any, idx: number) => ({
            id: t.id || idx,
            title: t.project,
            start: new Date(t.start),
            end: new Date(t.end),
            color: '#cba158',
            project: t.project,
          }));
          setEvents(loaded);
        }
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    };
    loadTasks();
  }, []);

  const moveEvent = ({ event, start, end }: {event: Event; start: Date; end: Date }) => {
    const updated = events.map((e) =>
    e.id === event.id ? { ...e, start, end } : e
  );
  setEvents(updated);
  }
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date}) => {
    setSlotInfo({ start, end });
    setModalOpen(true);
  }
  const handleAddEvent = async (slotInfo: SlotInfo) => {
    if (!slotInfo) return;
      const newEvent: Event = {
        id: events.length + 1,
        title: eventTitle || 'Untitled event',
        start: slotInfo?.start,
        end: slotInfo?.end,
        color: eventColor || '#cba158',
        project: eventTag || '',
      }
      setEvents([...events, newEvent]);
      try {
        await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ project: newEvent.title, start: newEvent.start, end: newEvent.end })
        });
      } catch (e) {
        console.error('Error saving task:', e);
      }
      setModalOpen(false);
      setSlotInfo(null);
      setEventTitle('');
      setEventColor('');
      setEventTag('');

    const addEventFromTracker = async (ev: TrackerEvent) => {
    const newEvent: Event = {
      id: events.length + 1,
      title: ev.title,
      start: ev.start,
      end: ev.end,
      color: '#cba158',
      project: ev.title,
    };
    setEvents([...events, newEvent]);
    try {
      await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project: newEvent.title, start: newEvent.start, end: newEvent.end })
      });
    } catch (e) {
      console.error('Error saving task:', e);
    }
  };
    }
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '80vh', margin: '20px' }} className='w-full'>
        <TimeTracker onNewEntry={addEventFromTracker} />
        {modalOpen ?
      <div className='h-80 overflow-y-auto bg-neutral-700 p-4 w-full border-1 border-gray-500 flex flex-col'>
        <Button onClick={() => setModalOpen(false)}>x</Button>
        <h4 className='p-4'>Please fill in your event details:</h4>
        <div className='p-2'>Event Title: <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} /></div>
        <div className='p-2'>Event Color: <input value={eventColor} type="color" onChange={(e) => setEventColor(e.target.value)} /></div>
        <div className='p-2'>Event Tag: <input value={eventTag} onChange={(e) => setEventTag(e.target.value)} /></div>
        <Button onClick={() => handleAddEvent(slotInfo)}>SEND</Button>
      </div>
      :
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='week'
        onEventDrop={moveEvent}
        resizable
        selectable
        onEventResize= {moveEvent}
        onSelectSlot= {handleSelectSlot}
        eventPropGetter={(event: any) => ({
          style: {
            backgroundColor: event.color || '#3b82f6',
            color: '#000',
            borderRadius: '0',
            padding: '4px',
            border: '5px solid #000',
            fontWeight: '700'
          }
        })}
        />
      }
        
      </div>
    </DndProvider>
  )
}
export default CalendarComponent