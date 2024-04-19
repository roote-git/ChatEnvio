export interface IChatByMessage {
  enviadoPorMim: string;
  origem: string;
  mensagem: string;
  dataDeEnvio: string;
  id?: string; 
}

export interface IChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt: Date;
  id?: string; 
}