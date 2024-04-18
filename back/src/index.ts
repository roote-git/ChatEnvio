import path from "path";
import express from "express";
import { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";
import bodyParser from "body-parser";
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const app = express();
export const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

const broadcast = (msg: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected");
  const heartbeat = () => {
    console.log("Heartbeat");
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

//Mensagem exemplo
const messages: ChatMessageProps[] = [
  { fromMe: false, senderName: "Small Talk", text: "Hoje tá quente, né?", createdAt: new Date() },
];

//Puxa todas as msgs do DB e joga pro array de mensagens
async function getAllMessages() {
  const dbPath = path.resolve(__dirname, 'mensagens.db');
  open({
    filename: dbPath,
    driver: sqlite3.Database
  }).then((db) => {
    console.log("DB Aberto com sucesso")
    const result = db.all(`SELECT * FROM mensagens`).then((row) => {
      row.forEach((element) => {
        messages.push(JSON.parse(element.mensagemJson))
      });
    }).then(() => {
      db.close()
      console.log("DB Fechado")
    })
  }).catch((err) => {
    console.log("Erro ao abrir o DB: " + err)
  })
}

getAllMessages()

app.get("/message", (_: Request, res: Response) => {
  console.log("GET /message");
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

async function insertMessage(stringfiedMessage: string) {
  const dbPath = path.resolve(__dirname, 'mensagens.db');
  open({
    filename: dbPath,
    driver: sqlite3.Database
  }).then((db) => {
    console.log("DB Aberto com sucesso")
    const result = db.run('INSERT INTO mensagens(mensagemJson) VALUES (:mensagemJson)', {
      ':mensagemJson': stringfiedMessage
    })
    
  }).catch((err) => {
    console.log("Erro ao abrir o DB: " + err)
  })
}

app.post("/message", (req: Request, res: Response) => {
  console.log("POST /message Iniciado");
  const body = req.body;
  const message = {
    ...body,
    createdAt: new Date(),
  };

  console.log("----");
  console.log("message ENVIADO AGORA: ", message);
  console.log("----");
  messages.push(message);
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

server.listen(3000, async () => {
  //Fazer uma lógica para buscar as mensgens salvas no BD ao iniciar
  console.log(`Chat Envio Server started on port 3000 :)`);
});
