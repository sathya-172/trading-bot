// app/api/bot/stop/route.js
export async function POST() {
    await fetch('http://localhost:3000/bot/stop', { method: 'POST' });
    return new Response(JSON.stringify({ status: 'stopped' }), { status: 200 });
}
