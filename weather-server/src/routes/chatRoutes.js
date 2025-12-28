import express from 'express';
import chatController from '../controllers/chatController.js';

const router = express.Router(); 

router.post('/send', chatController.postMessage);

router.get('/history', chatController.getHistory);

export default router;