import React from 'react';
import styles from "../../styles/chat__styles/Chat.module.css";
import { formatTimeSeparator } from '../../utils/dateUtils';
import type { MessagesData } from '../../types/chat.types';


const ChatMessage: React.FC<MessagesData> = ({ role, content, createdAt }) => {
    const timeString = formatTimeSeparator(createdAt);
    const containerClass = role === 'user' ?  styles.singleMessageLeft : styles.singleMessageRight;

    return (
        <div className={containerClass}>
            <div className={styles.contentMessage}>
                <h3 className={styles.message}>{content}</h3>
                <p className={styles.time}>{timeString}</p>
            </div>
        </div>
    );
};

export default ChatMessage;