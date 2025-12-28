# 🌤️ Chibi Weather Assistant

**Chibi Weather Assistant** is a full-stack pet project that combines **current weather**, a **12-hour weather forecast**, and an **AI-powered chat with an emotional chibi assistant**.

On the surface, it looks like a compact weather app with a chat interface, but internally it is a **large-scale architecture** built with **Node.js + Express** on the backend, **React** on the frontend, and **MongoDB** as the database, totaling around **30,000 lines of code**.

---

🎥 Demo video: https://www.youtube.com/watch?v=Nsal9Coj7b0

---

## 🎨 User Interface (UI)

📐 **Figma link:**  
https://www.figma.com/design/9gk9WlsX66BYlmFNWTeCcr/Chibi-weather-assistant?node-id=0-1&t=Qx3PpCkrdGFASayl-1

---

## ✨ Key Features

### 🌡️ Weather

* Current weather (temperature, feels-like, sky condition)
* Humidity, pressure, wind speed and direction
* Sunrise and sunset time
* Location based on coordinates (lat / lon)
* Support for measurement units: `metric` / `imperial`

### ⏱️ Hourly Forecast

* **12-hour weather forecast**
* Temperature, weather condition, wind
* Local time handling with timezone support
* Visual temperature curve

### 🤖 AI Chat with Chibi Assistant

* Integration with **OpenAI API**
* Context-aware responses based on:

  * current weather
  * hourly forecast
  * location
* Emotional reactions from the assistant
* Dynamic chibi sprites depending on emotion
* Automatic response format repair (fallback parsing + auto-fix)

---

## 🧠 Project Architecture

### Backend

* **Node.js + Express**
* Service-based architecture (controllers / services / utils)
* Cron jobs for updating weather data every 30 minutes
* Integration with OpenWeatherMap API
* Integration with OpenAI API
* Error handling and data validation

### Frontend

* **React + TypeScript**
* Controlled forms
* Proper coordinate handling (min/max clamp)
* Dynamic UI
* Full page reload after settings change
* Interactive chat interface

### Database

* **MongoDB**
* Logical separation of data by application domain

---

## 🗄️ Database Structure (MongoDB)

For correct operation, you need to create a **MongoDB server** with the following databases:

* `chat-db` — chat message history and sessions
* `weather-config-db` — weather settings and cached weather data

---

## ⚙️ Environment Configuration

In the `config/` directory, create a **`.env`** file:

```env
PORT=3001
NODE_ENV=development

EXTERNAL_API_URL=https://api.openweathermap.org/data
EXTERNAL_API_KEY=[OpenWeatherMap API key]

OPENAI_API_KEY=[OpenAI API key]

DB_BASE_URL=mongodb://127.0.0.1:27017/
```

> 🔑 **Note:** API keys are not stored in the repository and must be provided manually.

---

## 🚀 Running the Project

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

## 📌 Notes

* The project does not use authentication (a deliberate decision for a pet project)
* The main focus is on **architecture**, **logic**, **UX**, and **service integration**
* The project is completed as **v1.0**

---

## 🎨 Art

Chibi character and illustrations:
**Art by: UYU.ART**

---

## 🧩 Project Status

✅ Completed (Pet Project, v1.0)
🛠️ Possible future extensions:

* authentication
* user profiles
* deployment
* mobile version
