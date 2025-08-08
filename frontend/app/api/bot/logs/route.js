import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import fs from 'fs'; // for existsSync
import path from 'path';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), '..', 'backend', 'logs', 'bot.log');

    console.log('📁 Checking log file at:', logPath);

    if (!fs.existsSync(logPath)) {
      console.error('❌ bot.log not found at:', logPath);
      return NextResponse.json({ error: 'Log file not found' }, { status: 404 });
    }

    const logData = await readFile(logPath, 'utf8');

    return NextResponse.json({ log: logData || '[Log file is empty]' });
  } catch (error) {
    console.error('❌ Error reading log file:', error);
    return NextResponse.json(
      { error: 'Failed to read logs', details: error.message },
      { status: 500 }
    );
  }
}
