import React, { useEffect, useState } from 'react';
import Button from './Button';

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
  project?: string;
}

interface Props {
  onNewEntry: (ev: CalendarEvent) => void;
}

const TimeTracker: React.FC<Props> = ({ onNewEntry }) => {
  const [project, setProject] = useState('');
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && startTime) {
      timer = setInterval(() => {
        setElapsed(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [running, startTime]);

  const formatElapsed = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggle = async () => {
    if (!running) {
      setStartTime(new Date());
      setElapsed(0);
      setRunning(true);
    } else {
      const end = new Date();
      if (startTime) {
        const entry = { title: project || 'Work', start: startTime, end };
        onNewEntry(entry);
        try {
          await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ project: entry.title, start: entry.start, end: entry.end }),
          });
        } catch (e) {
          console.error('Error saving task:', e);
        }
      }
      setRunning(false);
      setStartTime(null);
      setElapsed(0);
      setProject('');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <input
        className="text-black p-1"
        placeholder="Project"
        value={project}
        onChange={(e) => setProject(e.target.value)}
      />
      <Button onClick={toggle}>{running ? 'Stop' : 'Start'}</Button>
      {running && <span>{formatElapsed(elapsed)}</span>}
    </div>
  );
};

export default TimeTracker;