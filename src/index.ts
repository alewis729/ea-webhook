import express, { Request, Response } from 'express';
import WebSocket from 'ws';
import 'dotenv/config';

import { tvIpAddressList, processAlert, getNow } from "./utils";
import { isNil } from "lodash";

const app = express();
const port = process.env.PORT ?? 3000;

const wss = new WebSocket.Server({ port: 8080 });
let connectedClients: WebSocket[] = [];

wss.on("connection", (ws) => {
  console.log({ mstatus: "🍏 Client connected.", date: getNow() });
  connectedClients.push(ws);

  ws.on("message", (message) => {
    console.log({
      mstatus: `Received from python: ${message}`,
      date: getNow(),
    });
  });

  ws.on("pong", () => {
    console.log({ mstatus: "🏓 Pong", date: getNow() });
  });

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
      console.log({ mstatus: "🏓 Ping", date: getNow() });
    }
  }, 30000);

  ws.on("close", () => {
    console.log({ mstatus: "🍎 Client disconnected.", date: getNow() });
    connectedClients = connectedClients.filter((client) => client !== ws);
    clearInterval(interval);
  });
});

app.set("trust proxy", true);
app.use(express.json());
app.use(express.text());

app.use((req: Request, res: Response, next) => {
  const reqIp = req.ip ?? "";
  const acceptReqFromAnyIP = process.env.ACCEPT_ANY_IP === "true";

  if (acceptReqFromAnyIP || tvIpAddressList.includes(reqIp)) {
    next();
  } else {
    console.log({ mstatus: "Invalid IP.", reqIp });
    res.status(403).send("Forbidden: Invalid IP");
  }
});

app.post("/webhook", (req: Request, res: Response) => {
  const content = req.body;
  const contentType = req.headers["content-type"];
  const isJson = contentType?.includes("application/json");
  const processedData = processAlert({
    ...(isJson ? { jsonData: content } : { textData: content }),
  });

  console.log({
    mstatus: "🔔 Webhook received a request.",
    date: getNow(),
    contentType,
    received: content,
    processedData,
  });

  if (isNil(processedData)) {
    console.log({
      mstatus: "Webhook received unexpected data. Won't propagate information.",
      date: getNow(),
    });
    res
      .status(200)
      .send("Webhook received unexpected data. Won't propagate information.");
  } else {
    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(processedData));
      }
    });
    res.status(200).send("Webhook received the request.");
  }
});

app
  .listen(port, () => {
    console.log("---------- ---------- ---------- ---------- ----------");
    console.log(`🚀 Server running on port ${port}`);
  })
  .on("upgrade", (request, socket, head) => {
    if (request.url === "/websocket") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

module.exports = app;
