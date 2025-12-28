import express from 'express';
import weatherRoutes from './routes/weatherRoutes.js'; 
import chatRoutes from './routes/chatRoutes.js'; 
import globalErrorHandler from './middlewares/errorHandler.js'; 
import AppError from './utils/appError.js';
import cors from 'cors';
import { startWeatherCron } from "./cron/weather.cron.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
}));

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the Weather API!',
    status: 'Running'
  });
});

app.use('/api/v1/weather', weatherRoutes); 
app.use('/api/v1/chat', chatRoutes); 

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); 
});

app.use(globalErrorHandler); 

startWeatherCron();

export default app;