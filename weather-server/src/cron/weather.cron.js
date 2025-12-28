import cron from "node-cron";
import weatherController from '../controllers/weatherController.js';

export function startWeatherCron() {
  weatherController.updateWeatherController().catch((err) => {
    console.error("❌ Initial weather update failed:", err.message);
  });

  cron.schedule("*/30 * * * *", () => {
     weatherController.updateWeatherController().catch((err) => {
      console.error("❌ Weather cron update failed:", err.message);
    });
  });
}