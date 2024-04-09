import express, { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";

const app = express();
export const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

const broadcast = (msg: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
};

wss.on("connection", (ws) => {
  const heartbeat = () => {
    if (!ws) return;
    if (ws.readyState !== 1) return;
    ws.send(
      JSON.stringify({
        type: "heartbeat",
        msg: true,
      })
    );
    setTimeout(heartbeat, 20000);
  };
  heartbeat();
});

app.use(cors({ origin: "*" }));
app.use(express.json());

interface ChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt: Date;
}
const messages: ChatMessageProps[] = [
  { fromMe: true, senderName: "Ediguinhos", text: "Olá!", createdAt: new Date() },
];
app.get("/message", (_: Request, res: Response) => {
  // TODO 
  /**
   * Desenvolva uma lógica eficiente para listar as mensagens contidas no array, 
   * assegurando uma apresentação organizada e acessível aos usuários. 
   * Essa implementação proporcionará uma experiência de visualização clara e 
   * facilitará a interação com as mensagens disponíveis.
  */
  const sortedMessages = messages.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return res.json(sortedMessages);
});

app.post("/message", (req: Request, res: Response) => {
  const body = req.body;
  const message = {
    ...body,
    createdAt: new Date(),
  };
  messages.push(message);

  broadcast({
    type: "message",
    message,
  });

  res.json(message);
});

app.all("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "URL not found" })
);

server.listen(3000, async () => {
  console.log(`Server started on port 3000 :)`);
});
