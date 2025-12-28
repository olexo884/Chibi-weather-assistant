import mongoose from 'mongoose';

const DB_BASE_URL = process.env.DB_BASE_URL;

if (!DB_BASE_URL) {
    console.error("CRITICAL ERROR: DB_BASE_URL is not set in environment variables.");
}

export const weatherDBConnection = mongoose.createConnection(`${DB_BASE_URL}weather-config-db`);
weatherDBConnection.on('connected', () => {
    console.log('✅ Weather Config DB connected.');
});
weatherDBConnection.on('error', (err) => {
    console.error('❌ Weather DB connection error:', err.message);
});


export const chatDBConnection = mongoose.createConnection(`${DB_BASE_URL}chat-db`);
chatDBConnection.on('connected', () => {
    console.log('✅ Chat DB connected.');
});
chatDBConnection.on('error', (err) => {
    console.error('❌ Chat DB connection error:', err.message);
});
