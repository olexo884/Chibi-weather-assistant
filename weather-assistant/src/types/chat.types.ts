export interface MessagesData {
  _id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  mood: string | null;
  createdAt: string;
  __v?: number;
}

export interface DateSeparatorData {
  _id: string;
  sessionId: string;
  role: "date";
  mood: null;
  createdAt: string;
  __v?: number;
}


export interface APISendData {
  status: 'success' | 'error' | "fail";
  data: {
    messages: MessagesData[] | DateSeparatorData[];
  }
}

export interface APIGetData {
  status: 'success' | 'error' | "fail";
  results: number;
  nextCursor: string;
  data: {
    messages: MessagesData[] | DateSeparatorData[];
  }
}


export type ChatProps = {
  messages: MessagesData[] | DateSeparatorData[];
  nextCursor: string;
};