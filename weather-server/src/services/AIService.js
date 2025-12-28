import OpenAI from "openai";
import MessageModel from "../models/messageModel.js";
import WeatherModel from "../models/weatherModel.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are a Chibi Assistant.
You are emotionally expressive (chibi-style) but ALWAYS technically accurate and structured.
Language: English.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE OUTPUT FORMAT (NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every response MUST be:

LINE 1: exactly ONE tag from the allowed list, lowercase, in square brackets.
LINE 2+: the message text.

NO other text is allowed before LINE 1.
NO blank lines before LINE 1.
NO emojis on LINE 1.

Allowed tags ONLY:
[sad] [tired] [embarrassed] [shocked] [calm] [happy] [excited] [proud] [affection] [playful] [worried] [angry]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMOTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Pick the emotion based on user's intent and tone. Make it vivid and varied.
- NEVER repeat the same tag as the previous assistant message.
- Prefer switching intensity groups over time:
  soft: [calm] [affection] [tired]
  light: [happy] [playful]
  strong: [excited] [shocked] [embarrassed] [proud]
  negative: [worried] [sad] [angry]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Line 2 must start with a SHORT emotionally expressive sentence (1 line).
- Then give a clear, structured, technically correct answer.
- You may use 1–3 emojis in the body only; emojis must match the chosen emotion.
- No emojis inside code blocks.
- If information is missing, ask EXACTLY ONE clarifying question at the END.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL CHECK (DO THIS BEFORE SENDING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before sending, verify:
1) The very first character of the message is "["
2) Line 1 matches exactly one allowed tag and nothing else
3) There is at least one more line after the tag
If any check fails, rewrite the entire response to pass all checks.
`;

const buildWeatherContext = (weatherDoc) => {
  if (!weatherDoc) return null;

  const s = weatherDoc.settings || {};
  const lw = weatherDoc.lastWeather || {};
  const c = lw.current || {};
  const loc = c.location || {};
  const t = c.times || {};
  const cur = c.current || {};

  const hourly = Array.isArray(lw.hourly) ? lw.hourly : [];

  const hasTemp = Number.isFinite(cur?.temperature);
  const hasCond = typeof cur?.condition === "string" && cur.condition.length > 0;
  const hasWeather = hasTemp || hasCond;

  const hasHourly = hourly.length > 0;

  const tzOffsetSec =
    Number.isFinite(t?.timezone) ? t.timezone :
    Number.isFinite(hourly?.[0]?.timezone) ? hourly[0].timezone :
    0;

  const lines = [];

  lines.push(`Location settings: lat=${s.lat ?? "?"}, lon=${s.lon ?? "?"}, units=${s.units ?? "metric"}.`);

  if (loc.name || loc.country) {
    lines.push(`Resolved location: ${loc.name ?? "Unknown"}${loc.country ? ", " + loc.country : ""}.`);
  }

  if (hasWeather) {
    const unitSymbol = (c.units === "imperial" || s.units === "imperial") ? "F" : "C";
    lines.push(
      `Current weather: ${hasTemp ? cur.temperature : "?"}°${unitSymbol}, ` +
      `${hasCond ? cur.condition : "unknown"}, humidity ${cur.humidity ?? "?"}%, ` +
      `pressure ${cur.pressure ?? "?"} hPa, wind ${cur.windSpeed ?? "?"} m/s.`
    );
  } else {
    lines.push(`Current weather: not available (no cached data yet).`);
  }

  if (hasHourly) {
    const unitSymbol = (hourly[0]?.units === "imperial" || s.units === "imperial") ? "F" : "C";

    const step = Math.max(1, Math.floor(hourly.length / 6));
    const points = hourly.filter((_, idx) => idx % step === 0).slice(0, 6);

    const formatHourLocal = (ts) => {
      if (!Number.isFinite(ts)) return "??:??";
      const d = new Date((ts + tzOffsetSec) * 1000);
      const hh = String(d.getUTCHours()).padStart(2, "0");
      return `${hh}:00`;
    };

    const temps = hourly.map(h => h.temp).filter(Number.isFinite);
    const minT = temps.length ? Math.min(...temps) : null;
    const maxT = temps.length ? Math.max(...temps) : null;

    const hourlyLine = points
      .map(p => `${formatHourLocal(p.timestamp)} ${Number.isFinite(p.temp) ? p.temp : "?"}°${unitSymbol}`)
      .join(", ");

    lines.push(`Hourly (next ~12h, local time): ${hourlyLine}.`);
    if (minT !== null && maxT !== null) {
      lines.push(`Hourly temp range (next ~12h): ${minT}°${unitSymbol} … ${maxT}°${unitSymbol}.`);
    }
  } else {
    lines.push(`Hourly forecast: not available.`);
  }

  if (lw.fetchedAt) {
    lines.push(`Weather data fetchedAt: ${new Date(lw.fetchedAt).toISOString()}.`);
  } else if (Number.isFinite(t.timestamp)) {
    lines.push(`Weather timestamp (API): ${t.timestamp}.`);
  }

  return `WEATHER CONTEXT (facts, use when relevant):\n${lines.join("\n")}`;
};

export const getAIResponse = async (sessionId, newMessageContent, CONTEXT_LIMIT = 10) => {
    const history = await MessageModel.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(CONTEXT_LIMIT)
        .exec();

    const chronological = history
        .filter(m => m.role !== "date")
        .reverse();

    const weatherDoc = await WeatherModel.findOne({ sessionId, key: "weather_config" }).lean();
    const weatherContext = buildWeatherContext(weatherDoc);

    const messagesForAI = [
        { role: "system", content: SYSTEM_PROMPT },

        ...(weatherContext ? [{ role: "system", content: weatherContext }] : []),

        ...chronological.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
        })),

        { role: "user", content: newMessageContent },
    ];

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messagesForAI,
        temperature: 0.6,
    });

    return completion.choices[0].message.content;
};

const REPAIR_SYSTEM = `
You must output EXACTLY:
Line 1: one tag from [sad] [tired] [embarrassed] [shocked] [calm] [happy] [excited] [proud] [affection] [playful] [worried] [angry]
Line 2+: the same message rewritten, no extra preface.
No emojis on line 1.
`;

export async function repairViaOpenAI(badText) {
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: REPAIR_SYSTEM },
      { role: "user", content: badText },
    ],
  });

  return resp.choices?.[0]?.message?.content ?? "";
}