import express, { Request, Response } from 'express';
import { allowedIPs, processAlert } from './utils';

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.use(express.json());

app.use((req: Request, res: Response, next) => {
  const reqIp = req.ip ?? '';
  if (allowedIPs.includes(reqIp)) {
    next();
  } else {
    console.log({ mstatus: 'Invalid IP', reqIp });
    res.status(403).send('Forbidden: Invalid IP');
  }
});

app.post('/webhook', (req: Request, res: Response) => {
  console.log({
    mstatus: 'Webhook received an alert.',
    content: req.body,
    processed: processAlert(req.body)
  });
  res.status(200).send('Webhook received the alert.');
});

app.listen(port, () => {
  console.log('---------- ---------- ---------- ---------- ----------');
  console.log(`🚀 Server running on port ${port}`);
});
