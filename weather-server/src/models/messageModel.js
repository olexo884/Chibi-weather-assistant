import mongoose from 'mongoose';
import { chatDBConnection } from '../database/db.config.js'; // З'єднання з БД 'chat-db'

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'assistant', 'date']
    },
    content: {
        type: String,
        required: function () {
            return this.role !== 'date';
        },
        default: null
    },
    mood: {
        type: String,
        required: function () {
            return this.role === 'assistant';
        },
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


messageSchema.index({ sessionId: 1, createdAt: -1 });

const MessageModel = chatDBConnection.model('Message', messageSchema);
export default MessageModel;