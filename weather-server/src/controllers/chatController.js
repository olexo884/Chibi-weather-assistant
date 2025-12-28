import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js'
;
import { sendMessageAndGetAIResponse, getHistoryFromServer } from '../services/chatService.js'; 

/**
 * Обробляє запит на надсилання нового повідомлення користувача.
 * Зберігає повідомлення користувача, викликає ШІ, зберігає відповідь ШІ.
 */
export const postMessage = catchAsync(async (req, res, next) => {
    
    const { sessionId, content } = req.body;

    if (!sessionId || !content) {
        return next(new AppError('Session ID and message content are required.', 400));
    }

    const newMessages = await sendMessageAndGetAIResponse(sessionId, content);

    res.status(201).json({
        status: 'success',
        data: {
            messages: newMessages 
        }
    });
});

/**
 * Обробляє запит на отримання історії чату з пагінацією.
 * Використовує курсор (lastMessageDate) для підвантаження старих повідомлень.
 */
export const getHistory = catchAsync(async (req, res, next) => {
    
    const { sessionId, limit, lastMessageDate } = req.query;

    if (!sessionId) {
        return next(new AppError('Session ID is required.', 400));
    }

    const { messages, nextCursor } = await getHistoryFromServer(
        sessionId,
        parseInt(limit) || 30,
        lastMessageDate || null
    );

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            messages: messages
        },
        nextCursor: nextCursor 
    });
});

export default { postMessage, getHistory };