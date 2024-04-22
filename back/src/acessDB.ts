import path from "path";
import { Request, Response } from 'express';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { broadcast } from "./index";

// Segunda etapa, separando as funções de acesso ao banco de dados
// do arquivo principal "index.ts" para o arquivo "acessDB.ts"
// para organizar o código e facilitar implementações futuras.


// Funções para captura e alteração do nome do grupo
export function getGroupName(req: Request, res: Response) {
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

export function setGroupName(req: Request, res: Response){
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
}

// Funções para captura e alteração do ícone do grupo
export function getGroupIcon(req: Request, res: Response) {
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

export function setGroupIcon (req: Request, res: Response){
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
}