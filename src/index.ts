import express, { Request, Response } from 'express';
import WebSocket from 'ws';
import 'dotenv/config';

import { tvIpAddressList, processAlert } from './utils';

const app = express();
const port = process.env.PORT ?? 3000;

const wss = new WebSocket.Server({ port: 8080 });
let connectedClients: WebSocket[] = [];

wss.on('connection', (ws) => {
  console.log({ mstatus: 'Client connected via WebSocket.' });
  connectedClients.push(ws);

  ws.on('message', (message) => {
    console.log(`Received from python: ${message}`);
  });

  ws.on('close', () => {
    console.log({ mstatus: 'Client disconnected.' });
    connectedClients = connectedClients.filter((client) => client !== ws);
  });
});

app.set('trust proxy', true);
app.use(express.json());
app.use(express.text());

app.use((req: Request, res: Response, next) => {
  const reqIp = req.ip ?? '';
  const acceptReqFromAnyIP = process.env.ACCEPT_ANY_IP === 'true';

  if (acceptReqFromAnyIP || tvIpAddressList.includes(reqIp)) {
    next();
  } else {
    console.log({ mstatus: 'Invalid IP.', reqIp });
    res.status(403).send('Forbidden: Invalid IP');
  }
});

app.post('/webhook', (req: Request, res: Response) => {
  const content = req.body;
  const contentType = req.headers['content-type'];
  const isJson = contentType?.includes('application/json');
  const processedData = processAlert(content, isJson);

  console.log({
    mstatus: 'Webhook received an alert.',
    content,
    contentType,
    isJson,
    processedData
  });

  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(processedData));
    }
  });
  res.status(200).send('Webhook received the alert.');
});

app.listen(port, () => {
  console.log('---------- ---------- ---------- ---------- ----------');
  console.log(`🚀 Server running on port ${port}`);
}).on('upgrade', (request, socket, head) => {
  if (request.url === '/websocket') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
})

module.exports = app;
