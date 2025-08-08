'use client';

export default function ControlPanel({ status, setStatus }) {

  const handleAction = async (action) => {
    setStatus('PROCESSING');
    await fetch(`/api/bot/${action}`, { method: 'POST' });
    setStatus(action === 'start' ? 'RUNNING' : 'STOPPED');
  };

  return (
    <div className="space-x-4">
      <button onClick={() => handleAction('start')} className="bg-green-600 text-white px-4 py-2 rounded">
        Start Bot
      </button>
      <button onClick={() => handleAction('stop')} className="bg-red-600 text-white px-4 py-2 rounded">
        Stop Bot
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
