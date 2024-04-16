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
  try {
    const sortedMessages = messages.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    const reformulatedList = []
    const months = ['Janeiro', 'Fevereiro', 'Março',
      'Abril', 'Maio', 'Junho', 'Julio', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    for(let message of sortedMessages) {
      const day = message.createdAt.getDate()
      const month = message.createdAt.getMonth()
      const year = message.createdAt.getFullYear()
      const hour = message.createdAt.getHours()
      const minute = message.createdAt.getMinutes()
      const createdValue = `${day} de ${months[month]} de ${year} às ${hour}:${minute}`
      const reformulatedObject = {
        enviadoPorMim: message.fromMe ? "Sim" : "Não",
        origem: message.senderName,
        mensagem: message.text,
        dataDeEnvio: createdValue
      }
      reformulatedList.push(reformulatedObject)
    }
    return res.status(200).json(reformulatedList);
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro interno no servidor"});
  }
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
