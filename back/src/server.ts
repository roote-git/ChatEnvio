import 'dotenv/config';
import express from "express";
import connectToDatabase from './Models/connection';
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000
connectToDatabase()
  .then( async () => {
    server.listen(PORT, async () => {
      console.log(`Server started on port 3000 :)`);
    });
  })
  .catch((error) => {
    console.log('Connection with database generated an error:\r\n');
    console.error(error);
    console.log('\r\nServer initialization cancelled');
    process.exit(0);
  });

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

export {
  app,
  wss,
  server
}
