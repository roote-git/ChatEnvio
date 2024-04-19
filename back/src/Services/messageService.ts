import { IChatMessageProps } from "../Interfaces/type";
import { create, findAll } from "../Models/messageODM";

const sendMessage = async (ms: IChatMessageProps):Promise<IChatMessageProps | null> => {
  if(ms) {
    const result = await create(ms);
    if (result !== null) {
      return result;
    }
  };
  return null;
};

const getAllMessages = async ():Promise<IChatMessageProps[] | null> => {
    const result = await findAll();
    if (result !== null) {
      return result;
    };
    return null;
};

export {
  sendMessage,
  getAllMessages
};
