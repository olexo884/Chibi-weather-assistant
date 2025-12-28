import React, { useRef, useEffect, useState, type ChangeEvent, useLayoutEffect } from 'react';

import styles from "../../styles/chat__styles/Chat.module.css";

import LoaderChibiIcon from '../../assets/icon/chat-icon/loading.png';
import GreetingChibiIcon from '../../assets/icon/chat-icon/greeting.png';
import { chibiIconMap } from '../../types/chibiMap.types.ts';

import SendIcon from '../../assets/icon/chat-icon/send.svg';

import ChatMessage from './ChatMessage';
import { formatDateSeparator } from '../../utils/dateUtils.ts';

import type { ChatProps } from '../../types/chat.types.ts';
import { fetchSendMessage, fetchGetMessages } from '../../api/chatApi.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '../loader/Loader.tsx';

const Chat: React.FC<ChatProps> = ({ messages, nextCursor }) => {

    const [chatInput, setChatInput] = useState("");
    const handleChatInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => { setChatInput(event.target.value); };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollEndRef = useRef<HTMLDivElement | null>(null);

    const mainRef = useRef<HTMLDivElement | null>(null);

    const [cursor, setCursor] = useState<string | null>(nextCursor ?? null);
    const [hasMore, setHasMore] = useState(Boolean(nextCursor));
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [localMessages, setLocalMessages] = useState(messages);

    useEffect(() => {
        setLocalMessages(messages);
        setCursor(nextCursor ?? null);
        setHasMore(Boolean(nextCursor));
    }, [messages, nextCursor]);

    useEffect(() => {
        if (textareaRef.current) {
            const element = textareaRef.current;
            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight > 121 ? 121 : element.scrollHeight}px`;
            element.style.overflowY = element.scrollHeight > 121 ? 'scroll' : 'hidden';
        }
    }, [chatInput]);

    const scrollToBottom = () => {
        scrollEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    const handleScroll = () => {
        const box = mainRef.current;
        if (!box) return;

        if (box.scrollTop <= 30) {
            loadMoreOld();
        }
    };

    useLayoutEffect(() => {
        requestAnimationFrame(() => scrollToBottom());
    }, [messages]);

    const queryClient = useQueryClient();
    const sendMutation = useMutation({
        mutationFn: (content: string) =>
            fetchSendMessage("/send", content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
            setChatInput("");
        },
        onError: (error: Error) => {
            console.error("Send error:", error.message);
        },
    });

    const handleSend = () => {
        if (sendMutation.isPending) return;
        const text = chatInput.trim();
        if (!text) return;
        sendMutation.mutate(text);
    };

    const loadMoreOld = async () => {
        if (isLoadingMore || !hasMore || !cursor) return;

        const box = mainRef.current;
        const prevScrollHeight = box?.scrollHeight ?? 0;

        setIsLoadingMore(true);
        try {
            const data = await fetchGetMessages("/history", cursor, 20);

            const newBatch = data.data.messages;
            const newCursor = data.nextCursor ?? null;

            if (!newBatch.length) {
                setHasMore(false);
                setCursor(null);
                return;
            }

            setLocalMessages(prev => [...newBatch, ...prev]);
            setCursor(newCursor);
            setHasMore(Boolean(newCursor));

            requestAnimationFrame(() => {
                const box2 = mainRef.current;
                if (!box2) return;
                const newScrollHeight = box2.scrollHeight;
                box2.scrollTop = (box2.scrollTop + (newScrollHeight - prevScrollHeight));
            });
        } finally {
            setIsLoadingMore(false);
        }
    };

    const chibiSrc = React.useMemo(() => {
        if (sendMutation.isPending) return LoaderChibiIcon;
        if (!localMessages.length) return GreetingChibiIcon;

        const mood = localMessages.at(-1)?.mood;
        return chibiIconMap[mood] ?? GreetingChibiIcon;
    }, [sendMutation.isPending, localMessages]);

    return (
        <article className={styles.chat}>
            <div className={styles.chibi}>
                <img src={chibiSrc} alt="Character art: UYU.ART" />
                <a target="_blank" href='https://x.com/uyu_arts'>Art by: UYU.ART</a>
                {sendMutation.isPending && <Loader />}
            </div>
            <div className={styles.main} ref={mainRef} onScroll={handleScroll}>
                {isLoadingMore && <div className={styles.loaderTop}>Loading...</div>}

                {localMessages.length ? localMessages.map((message) => (
                    <React.Fragment key={message._id}>
                        {message.role === "date" && (
                            <h4 className={styles.date}>{formatDateSeparator(message.createdAt)}</h4>
                        )}
                        {(message.role === "user" || message.role === "assistant") && (
                            <ChatMessage {...message} />
                        )}
                    </React.Fragment>
                )) : <h1>No messages found</h1>}

                <div ref={scrollEndRef}></div>
            </div>

            <div className={styles.messageInput}>
                <textarea
                    placeholder='Enter a message to the chibi...'
                    ref={textareaRef}
                    value={chatInput}
                    onChange={handleChatInputChange}
                    maxLength={600}
                    id="chat-textarea"
                    rows={1} />
                <button className={styles.sendButton}
                    onClick={handleSend}
                    disabled={sendMutation.isPending}>
                    <img src={SendIcon} alt="send" />
                </button>
            </div>
        </article>
    )
}


export default Chat