// app/api/bot/start/route.js
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST() {
  const scriptPath = path.join(process.cwd(), '../backend/scheduler.js');
  console.log(scriptPath)
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    }
    if (stdout) console.log('📤 Bot stdout:\n', stdout);
    if (stderr) console.error('⚠️ Bot stderr:\n', stderr);
  });

  return NextResponse.json({ status: 'Bot started' });
}
