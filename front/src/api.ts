import axios, { AxiosRequestConfig } from "axios";
import { ChatMessageProps } from "./components/ChatMessage";

export const url = import.meta.env.VITE_URL_HOST + ":" + import.meta.env.VITE_PORT;
//Segunda Etapa: Utilização de variáveis de ambiente para facilitar a configuração do servidor

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

// Segunda Etapa: Separado chatConfig de chatService
// para facilitar a organização do código em vista
//  de que um é utilizado para configurações dos dados do grupo
// e o outro para ações de envio e recebimento de mensagens

export const chatConfig = {
  setGroupName: async (groupName: string) => {
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
  },
  setGroupIcon: async (groupIcon: string) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/icon",
      data: { groupIcon },
    };

    return handleRequest(config);
  },
  getGroupIcon: async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/icon",
    };

    return handleRequest(config);
  }
}

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
