export const config = {
    schedule: '* * * * *', // every 1 minute
};

export async function GET() {
    console.log(`⏱️ Cron job triggered at ${new Date().toISOString()}`);

    // Optional: Call any backend logic here (e.g., cleanup, fetch, log WhatsApp stats)

    return new Response('Cron job ran successfully');
}
