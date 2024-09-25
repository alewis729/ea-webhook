# Webhook / Websocket server

This is a test webhook project. When sending alerts from TradingView to this webhook it will process the alert and communicate the processed information via websockets to a python script that acts as an EA (expert advisor) for MT5.

The EA will then make operations in MT5 based on market conditions and based of the information from these alerts.

### Test locally using curl

To test locally first create an `.env` file and add `ACCEPT_ANY_IP="true"` to it.

#### Simulate TradingView alert sending JSON:

```
Alert Message: {"text": "BTCUSD Greater Than 9000"}
```

```bash
curl -X POST http://localhost:3000/webhook -H 'Content-Type: application/json; charset=utf-8' -d '{"text": "BTCUSD Greater Than 9000"}'
# curl -X POST https://ea-webhook.vercel.app/webhook -H 'Content-Type: application/json; charset=utf-8' -d '{"text": "BTCUSD Greater Than 9000"}'
```

#### Simulate TradingView alert sending plain text:

```
Alert Message: BTCUSD Greater Than 9000
```

```bash
curl -X POST http://localhost:3000/webhook -H 'Content-Type: text/plain; charset=utf-8' -d 'BTCUSD Greater Than 9000'
# curl -X POST https://ea-webhook.vercel.app/webhook -H 'Content-Type: text/plain; charset=utf-8' -d 'BTCUSD Greater Than 9000'
```
