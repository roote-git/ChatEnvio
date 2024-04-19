import { Request, Response } from "express";
import { IChatMessageProps } from "../Interfaces/type";
import { app, wss } from "../server"
import { create, findAll } from "../Controller/messageController";
import errorHandler from "../Middlewares/errorHandler";

const broadcast = (msg: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
};

app.get("/message", async (_: Request, res: Response) => {
  // TODO 
  /**
   * Desenvolva uma lógica eficiente para listar as mensagens contidas no array, 
   * assegurando uma apresentação organizada e acessível aos usuários. 
   * Essa implementação proporcionará uma experiência de visualização clara e 
   * facilitará a interação com as mensagens disponíveis.
  */
  try {

    const result = await findAll();
    return res.status(200).json(result);

  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: e.message});
    };
  };
});

app.post("/message", errorHandler, async (req: Request, res: Response) => {
  const body = req.body;
  const message: IChatMessageProps = {
    ...body,
    createdAt: new Date(),
  };
  
  broadcast({
    type: "message",
    message,
  });

  try {

    const revampedMessages = await create(message);
    wss.emit("newMessage", revampedMessages)
    res.status(201).json(revampedMessages);

  } catch (e) {

    if (e instanceof Error){
      if (e.name === "500") {
        return res.status(500).json({ error: message });
      }
      res.status(400).json({ error: message });
    };
  
  }
});

app.all("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "URL not found" })
);
