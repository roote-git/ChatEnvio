import 'dotenv/config';
import path from "path";
import express from "express";
import { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { getGroupIcon, setGroupIcon, getGroupName, setGroupName } from './acessDB';

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
}

//Mensagem exemplo, para não iniciar o array vazio
const messages: ChatMessageProps[] = [
  { fromMe: false, senderName: "Small Talk", text: "Hoje tá quente, né?", createdAt: new Date() },
];

//Busca todas as msgs do DB e insere no array de mensagens
async function getAllMessages() {
  const dbPath = path.resolve(__dirname, 'mensagens.db');
  open({
    filename: dbPath,
    driver: sqlite3.Database
  }).then((db) => {
    db.all(`SELECT * FROM mensagens`).then((row) => {
      row.forEach((element) => {
        messages.push(JSON.parse(element.mensagemJson))
      });
    }).then(() => {
      db.close()
    })
  }).catch((err) => {
    console.log("Erro ao abrir o DB: " + err)
  })
}

getAllMessages()

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


//Função de inserir mensagens no DB
async function insertMessage(stringfiedMessage: string) {
  const dbPath = path.resolve(__dirname, 'mensagens.db');
  open({
    filename: dbPath,
    driver: sqlite3.Database
  }).then((db) => {
    db.run('INSERT INTO mensagens(mensagemJson) VALUES (:mensagemJson)', {
      ':mensagemJson': stringfiedMessage
    })
  }).catch((err) => {
    console.log("Erro ao abrir o DB: " + err)
  })
}

//Segunda etapa: Funções para manipular o nome e o ícone do grupo no DB
// agora serão importadas de outro arquivo
app.get("/icon", getGroupIcon);
app.post("/icon", setGroupIcon);
app.get("/group", getGroupName);
app.post("/group", setGroupName);

app.post("/message", (req: Request, res: Response) => {

  const body = req.body;
  const message = {
    ...body,
    createdAt: new Date(),
  };

  //messages.push(message);
  insertMessage(JSON.stringify(message))
  
  broadcast({
    type: "message",
    message,
  });

  res.json(message);
});






app.all("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "URL not found" })
);

server.listen(process.env.PORT, async () => {
  console.log('Servidor do ChatEnvio rodando na porta '+ process.env.PORT + ' :)');
});
