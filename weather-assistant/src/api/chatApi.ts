import axios, { AxiosError } from 'axios';
import type { APIGetData, APISendData } from '../types/chat.types';

const API_URL = "http://localhost:3001/api/v1/chat"
const sessionId = "60c72b21c43f33013d52485a";

export const fetchGetMessages = async (
    urlSuffix: string,
    lastMessageDate = null,
    limit = 20
): Promise<APIGetData> => {
    try {
        const { data } = await axios.get<APIGetData>(API_URL + urlSuffix, {
            params: {
                sessionId: sessionId,
                limit,
                lastMessageDate
            },
        });

        return data;
    } catch (e) {
        const error = e as AxiosError<{ message?: string }>;

        throw new Error(
            error.response?.data?.message ??
            error.message ??
            "Failed to fetch messages"
        );
    }
};

export const fetchSendMessage = async (
    urlSuffix: string,
    message: string
): Promise<APISendData> => {
    try {
        const { data } = await axios.post<APISendData>(API_URL + urlSuffix, {
            sessionId,
            content: message,
        });
        return data;
    } catch (e) {
        const err = e as AxiosError<{ message?: string }>;
        throw new Error(err.response?.data?.message ?? err.message);
    }
}