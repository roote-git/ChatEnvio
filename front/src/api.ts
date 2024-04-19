import axios, { AxiosRequestConfig } from "axios";
import { ChatMessageProps } from "./components/ChatMessage";

export const url = "localhost:3000"; //Impoortante trocar prao IP da máquina que está rodando o back

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
  sendGroupName: async (groupName: string) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/group",
      data: { groupName },
    };

    return handleRequest(config);
  },
  getGroupName: async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/group",
    };

    return handleRequest(config);
  }
};
