import 'dotenv/config';
import express from "express";
import { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";
import { getGroupIcon, setGroupIcon, getGroupName, setGroupName, getAllMessages, getMessages, postMessage } from './controllers';

const app = express();
export const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

export const broadcast = (msg: any) => {
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
    ws.send(JSON.stringify({ type: "messages", messages }));//Tom
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
  infoChangeMessage?: boolean;
}

//Mensagem exemplo, para não iniciar o array vazio, e dar um "start" na conversa
export const messages: ChatMessageProps[] = [
  {
    fromMe: false,
    senderName: "ChatEnvio", 
    text: "Bem-vindos! Sobre o que querem conversar hoje?",
    createdAt: new Date(),
    infoChangeMessage: true,
  },
];
//Busca todas as msgs do DB e insere no array de mensagens
getAllMessages()

// Segunda etapa: Setando para outro arquivo todas as funções de manipulação
// de mensagens, no banco de dados, que antes estavam no arquivo principal
app.get("/message", getMessages);
app.post("/message", postMessage);

// Segunda etapa: Funções para manipular o nome e o ícone do grupo no DB
// agora serão importadas de outro arquivo
app.get("/icon", getGroupIcon);
app.post("/icon", setGroupIcon);
app.get("/group", getGroupName);
app.post("/group", setGroupName);

app.all("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "URL not found" })
);

server.listen(process.env.PORT, async () => {
  console.log('Servidor do ChatEnvio rodando na porta '+ process.env.PORT + ' :)');
});
