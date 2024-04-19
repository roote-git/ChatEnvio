// Arquivos de criação de Schemas para o mongoose criar as Collections

import { Schema } from "mongoose";
import { IChatMessageProps } from "./Interfaces/type"

export const messageSchema = new Schema<IChatMessageProps>({
  text: { type: "string", required: true },
  senderName: { type: "string", required: true },
  fromMe: { type: "boolean", required: true},
  createdAt: { type: "date", required: true }
})


