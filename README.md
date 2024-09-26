# Webhook / Websocket server

This is a test webhook project. When sending alerts from TradingView to this webhook it will process the alert and communicate the processed information via websockets to a python script that acts as an EA (expert advisor) for MT5.

The EA will then make operations in MT5 based on market conditions and based of the information from these alerts.

### Test locally using curl

To test locally first create an `.env` file and add `ACCEPT_ANY_IP="true"` to it.

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
