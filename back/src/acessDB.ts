import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function getGroupIcon() {
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