import { NextFunction, Response, Request } from "express";

const errorHandler = (req: Request, res:Response, next: NextFunction) => {
  const { text, fromMe, senderName } = req.body;
  try {
    if (typeof text === "undefined") throw new Error("Faltando mensagem!");
    if (!fromMe) throw new Error("Valor invalido!");
    if (!senderName) throw new Error("Faltando Remetente!");
    return next();
  } catch (e) {
    if (e instanceof Error){
    return res.status(400).json({ error: e.message })
    }
    res.status(400).json({ error: "Valores invalidos ou faltando!"})
  }
}

export default errorHandler;
