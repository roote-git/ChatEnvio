import axios, { AxiosRequestConfig } from "axios";
import { ChatMessageProps } from "./components/ChatMessage";

export const url = "192.168.2.169:3000";

const api = axios.create({
  baseURL: "http://" + url,
});

const handleRequest = async (config: AxiosRequestConfig) => {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const chatService = {
  getAllMessages: async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/message",
    };

    return handleRequest(config);
  },
  sendMessage: async (message: ChatMessageProps) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/message",
      data: message,
    };

    return handleRequest(config);
  },
};
