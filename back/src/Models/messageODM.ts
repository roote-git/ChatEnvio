import { createConnection } from "mongoose";
import { messageSchema } from "../schema";
import { IChatMessageProps } from "../Interfaces/type";

const con = createConnection("mongodb://root:example@localhost:27017/")
const message = con.model("Message", messageSchema, "messages")

const create = async (ms: IChatMessageProps): Promise<IChatMessageProps | null> => {
  try {
    const result = await message.create(ms)
    return result
  } catch (error) {
    return null
  }
};

const findAll = async ():Promise<IChatMessageProps[] | null> => {
  try {
    return await message.find({});
  } catch (error) {
    return null
  }
};
export {
  create,
  findAll
};
