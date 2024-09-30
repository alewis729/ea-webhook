# Webhook / Websocket server

This is a NodeJS project that acts as a Webhook and WebSocket server. Its purpose is to receive alerts from TradingView or other clients, process the information and communicate that to all WebSocket clients.

For instance, an EA such as [ea-step-up](https://github.com/alewis729/ea-step-up) can connect to this WebSocket to receive the information on real-time and execute trading operations within MT5.

You can see a detailed explanation and demo in this [youtube video](https://youtu.be/uyo1dyzw83E).

### Test locally using curl

First Install and run the server

```bash
# git clone
npm install
npm run dev
```

Then, create an `.env` file and add `ACCEPT_ANY_IP="true"` to it.

#### Simulate TradingView alert sending JSON:

```
Alert Message: {"licenseId": 123123, command: "closeall", symbol: "BTCUSD"}
```

```bash
curl -X POST http://localhost:3000/webhook -H 'Content-Type: application/json; charset=utf-8' -d '{"licenseId": 123123, command: "closeall", symbol: "BTCUSD"}'
# curl -X POST http://localhost:3000/webhook -H 'Content-Type: application/json; charset=utf-8' -d '{"licenseId": 123123, command: "closeall", symbol: "BTCUSD"}'
```

#### Simulate TradingView alert sending plain text:

```
Alert Message: 729729,buylimit,XAUUSD,risk=0.08,price=2611.38043,sl=18.1,tp=77.2,comment="p4.1-XU-B"
```

```bash
curl -X POST http://localhost:3000/webhook -H 'Content-Type: text/plain; charset=utf-8' -d '729729,buylimit,XAUUSD,risk=0.08,price=2611.38043,sl=18.1,tp=77.2,comment="p4.1-XU-B"'
curl -X POST http://localhost:3000/webhook -H 'Content-Type: text/plain; charset=utf-8' -d '729729,buylimit,BTCUSD,risk=0.08,price=60000.05,sl=55123.45,tp=70000,comment="p4.1-BTC-A"'
# curl -X POST https://ea-webhook.vercel.app/webhook -H 'Content-Type: text/plain; charset=utf-8' -d '729729,buylimit,XAUUSD,risk=0.08,price=2611.38043,sl=18.1,tp=77.2,comment="p4.1-XU-B"'
```
