import 'dotenv/config';
import path from "path";
import express from "express";
import { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";
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

//Funções para manipular o nome e o ícone do grupo
app.get("/icon", (req: Request, res: Response) => {
  async function getGroupIcon() {
    const dbPath = path.resolve(__dirname, 'mensagens.db');
    open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then((db) => {
      db.all('SELECT icone FROM dadosGrupo WHERE id = 1').then((row) => {
        res.json({ groupIcon: row[0].icone });
      })
    }).catch((err) => {
      console.log("Erro ao abrir o DB: " + err)
    })
  }
  getGroupIcon()
});

app.post("/icon", (req: Request, res: Response) => {
  const body = req.body;
  const groupIcon = body.groupIcon;
  
  async function updateGroupIcon() {
    const dbPath = path.resolve(__dirname, 'mensagens.db');
    open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then((db) => {
      db.run('UPDATE dadosGrupo SET icone = (:icon) WHERE id = 1', {
        ':icon': groupIcon
      })
    }).catch((err) => {
      console.log("Erro ao abrir o DB: " + err)
    })
  }
  updateGroupIcon()

  broadcast({
    type: "group",
    groupIcon,
  });
});

app.get("/group", (req: Request, res: Response) => {
  async function getGroupName() {
    const dbPath = path.resolve(__dirname, 'mensagens.db');
    open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then((db) => {
      db.all('SELECT nome FROM dadosGrupo WHERE id = 1').then((row) => {
        res.json({ groupName: row[0].nome });
      })
    }).catch((err) => {
      console.log("Erro ao abrir o DB: " + err)
    })
  }

  getGroupName()
});

app.post("/group", (req: Request, res: Response) => {
  const body = req.body;
  const groupName = body.groupName;
  
  async function updateGroupName() {
    const dbPath = path.resolve(__dirname, 'mensagens.db');
    open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then((db) => {
      db.run('UPDATE dadosGrupo SET nome = (:name) WHERE id = 1', {
        ':name': groupName
      })
    }).catch((err) => {
      console.log("Erro ao abrir o DB: " + err)
    })
  }
  updateGroupName()

  broadcast({
    type: "group",
    groupName,
  });

  res.json({ groupName });
});





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
