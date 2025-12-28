import MessageModel from '../models/messageModel.js';
import { getAIResponse, repairViaOpenAI } from './AIService.js';
import AppError from '../utils/appError.js';

const ALLOWED_MOODS = new Set([
    "sad",
    "tired",
    "embarrassed",
    "shocked",
    "calm",
    "happy",
    "excited",
    "proud",
    "affection",
    "playful",
    "worried",
    "angry",
]);

const isSameUTCDay = (dateA, dateB) => {
    return (
        dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
        dateA.getUTCMonth() === dateB.getUTCMonth() &&
        dateA.getUTCDate() === dateB.getUTCDate()
    );
};

export const parseAIMoodAndContent = (rawText) => {
  const safeText = typeof rawText === "string" ? rawText : "";
  const text = safeText.trimStart();

  const moods = Array.from(ALLOWED_MOODS);
  const moodsGroup = moods.join("|");

  const normalizeMood = (m) => (m || "").trim().toLowerCase();
  const isAllowed = (m) => ALLOWED_MOODS.has(m);

  const removeOnce = (source, pattern) => {
    if (!pattern) return source;
    return source.replace(pattern, "").trim();
  };

  const strict = (() => {
    const m = text.match(/^\[([^\]]+)\]\s*\n?/);
    if (!m) return null;

    const moodRaw = normalizeMood(m[1]);
    const mood = isAllowed(moodRaw) ? moodRaw : "calm";
    const content = text.slice(m[0].length).trim();

    return {
      mood,
      content,
      repaired: !isAllowed(moodRaw),
      reason: isAllowed(moodRaw) ? null : "repaired_via_openai",
    };
  })();

  if (strict) return strict;

  const strategies = [
    () => {
      const re = new RegExp(
        `^\\s*[\\[\\(\\{\\<\\|\\*\\"]\\s*(${moodsGroup})\\s*[\\]\\)\\}\\>\\|\\*\\"]\\s*\\n?`,
        "i"
      );
      const m = text.match(re);
      return m ? { mood: normalizeMood(m[1]), removeRegex: re } : null;
    },

    () => {
      const re = new RegExp(`^\\s*(${moodsGroup})\\s*[:\\-—]\\s*\\n?`, "i");
      const m = text.match(re);
      return m ? { mood: normalizeMood(m[1]), removeRegex: re } : null;
    },

    () => {
      const re = new RegExp(
        `[\\[\\(\\{\\<\\|\\*\\"]\\s*(${moodsGroup})\\s*[\\]\\)\\}\\>\\|\\*\\"]`,
        "i"
      );
      const m = text.match(re);
      return m ? { mood: normalizeMood(m[1]), removeRegex: re } : null;
    },

    () => {
      const head = text.slice(0, 120);
      const re = new RegExp(`\\b(${moodsGroup})\\b`, "i");
      const m = head.match(re);
      return m ? { mood: normalizeMood(m[1]), removeRegex: re } : null;
    },
  ];

  const hit = strategies
    .map((fn) => fn())
    .find((res) => res && isAllowed(res.mood));

  const mood = hit?.mood ?? "calm";
  const cleaned = hit
    ? removeOnce(text, hit.removeRegex)
    : text.trim();

  return {
    mood,
    content: cleaned,
    reason: Boolean(hit) ? "repaired_via_openai" : null,
  };
};


// -----------------------------------------------------------
// A. ЛОГІКА НАДСИЛАННЯ (Збереження та Виклик ШІ)
// -----------------------------------------------------------
export const sendMessageAndGetAIResponse = async (sessionId, content) => {
    if (!sessionId) throw new AppError("Session ID is required", 400);
    if (!content || !content.trim()) throw new AppError("Message content is empty", 400);

    try {
        const lastMessage = await MessageModel.findOne({ sessionId })
            .sort({ createdAt: -1 })
            .select({ createdAt: 1, role: 1 })
            .lean();

        const now = new Date();

        const needDateSeparator =
            !lastMessage || !isSameUTCDay(new Date(lastMessage.createdAt), now);

        let dateMessage = null;
        if (needDateSeparator) {
            dateMessage = await MessageModel.create({
                sessionId,
                role: "date"
            });
        }

        const aiResponseContent = await getAIResponse(sessionId, content);

        if (!aiResponseContent) {
            throw new Error("Empty AI response");
        }

        let normalized = parseAIMoodAndContent(aiResponseContent);

        if (normalized.reason === "repaired_via_openai") {
            const repairedText = await repairViaOpenAI(aiResponseContent);
            normalized = parseAIMoodAndContent(repairedText);
        }

        const userMessage = await MessageModel.create({
            sessionId,
            role: "user",
            content,
        });

        const aiMessage = await MessageModel.create({
            sessionId,
            role: "assistant",
            content: normalized.content,
            mood: normalized.mood ?? "calm"
        });


        return dateMessage ? [dateMessage, userMessage, aiMessage] : [userMessage, aiMessage];
    } catch (error) {
        console.error("sendMessageAndGetAIResponse error:", error);

        if (error instanceof AppError) throw error;

        throw new AppError(error.message || "Failed to send message and get AI response", 500);
    }
};


// -----------------------------------------------------------
// B. ЛОГІКА ПАГІНАЦІЇ (Читання Історії)
// -----------------------------------------------------------
export const getHistoryFromServer = async (sessionId, limit = 20, cursor = null) => {
    if (!sessionId) throw new AppError('Session ID is required for chat history.', 400);

    const query = { sessionId };
    if (cursor) query.createdAt = { $lt: new Date(cursor) };

    const docs = await MessageModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    const nextCursor = docs.length ? docs[docs.length - 1].createdAt : null;

    const messages = docs.reverse();

    return { messages, nextCursor };
};
