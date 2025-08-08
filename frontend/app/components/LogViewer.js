'use client';
import { useEffect, useState } from 'react';

export default function LogViewer({ status }) {
  const [logs, setLogs] = useState([]);

  // Fetch once on initial mount
  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        const res = await fetch('/api/bot/logs');
        const data = await res.json();
        if (data && typeof data.log === 'string') {
          setLogs(data.log.split('\n').slice(-50));
        } else if (data?.error) {
          setLogs([`[Server error]: ${data.error}`]);
        } else {
          setLogs(['[No log data found]']);
        }
      } catch (err) {
        console.error('❌ Log fetch error:', err);
        setLogs(['[Error loading logs]']);
      }
    };

    fetchInitialLogs();
  }, []);

  // Polling logic based on status
  useEffect(() => {
    let interval;

    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/bot/logs');
        const data = await res.json();
        if (data && typeof data.log === 'string') {
          setLogs(data.log.split('\n').slice(-50));
        } else if (data?.error) {
          setLogs([`[Server error]: ${data.error}`]);
        }
      } catch (err) {
        console.error('❌ Log fetch error:', err);
      }
    };

    if (status === 'RUNNING') {
      interval = setInterval(fetchLogs, 3000);
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="bg-black text-green-400 p-4 mt-4 text-sm h-[300px] overflow-y-auto font-mono rounded">
      {logs.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
