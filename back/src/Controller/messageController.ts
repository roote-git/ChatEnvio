import { IChatMessageProps, IChatByMessage } from "../Interfaces/type";
import { sendMessage, getAllMessages } from "../Services/messageService";

const sortMessages = (messages: IChatMessageProps[]) => {
  const sortedMessages = messages.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  return sortedMessages;
}

const reformulateMessage = (message: IChatMessageProps) => {
  const months = ['Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho', 'Julio', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
    const day = message.createdAt.getDate();
    const month = message.createdAt.getMonth();
    const year = message.createdAt.getFullYear();
    const hour = message.createdAt.getHours();
    const minute = message.createdAt.getMinutes();
    const createdValue = `${day} de ${months[month]} de ${year} às ${hour}:${minute}`;
    const reformulatedObject: IChatByMessage = {
      enviadoPorMim: message.fromMe ? "Sim" : "Não",
      origem: message.senderName,
      mensagem: message.text,
      dataDeEnvio: createdValue,
      id: message.id
    };
  return reformulatedObject;
};

export const create = async (ms: IChatMessageProps):Promise<IChatByMessage> => {
  const { text, fromMe, senderName } = ms;
  if (typeof text !== "string") throw new Error("Mensagem invalida!");
  if (typeof fromMe !== "boolean") throw new Error("Valor invalido!");
  if (typeof senderName !== "string" || !senderName.length) throw new Error("Remetente invalido!");

  const result = await sendMessage(ms);

  if (result === null) {
    const errorMessage = "Problemas no servidor, não foi possilvel enviar a sua mensagem!";
    const err = new Error(errorMessage);
    err.name = "500";
    throw err;
  };

  const obj = reformulateMessage(result);
  return obj;
};

export const findAll = async ():Promise<IChatByMessage[]> => {
  const result = await getAllMessages();

  if (result === null) {
    throw new Error("Erro no servidor ao buscar mensagens.");
  };

  const reformulatedList: IChatByMessage[] = []
  const orderedMessages = sortMessages(result);

  for (let message of orderedMessages) {
    const ms = reformulateMessage(message);
    reformulatedList.push(ms);
  }

  return reformulatedList;
};