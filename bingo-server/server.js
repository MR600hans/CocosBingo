const WebSocket = require('ws');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
const port = 3000;

// 初始化或重置可用数字数组
function resetAvailableNumbers() {
    return Array.from({ length: 75 }, (_, i) => i + 1);
}

let availableNumbers = resetAvailableNumbers();
let drawnNumbers = [];

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    ws.on('message', (buffer) => {
        // 将 Buffer 对象转换成字符串
        const message = buffer.toString();
        console.log('Received message:', message);

        if (message === 'requestNumber') {
            if (availableNumbers.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                const drawnNumber = availableNumbers.splice(randomIndex, 1)[0];
                drawnNumbers.push(drawnNumber);

                // 发送开球数字给请求的客户端
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ number: drawnNumber }));
                    }
                });
            } else {
                // 所有数字都已被抽取，重置数字数组
                availableNumbers = resetAvailableNumbers();
                drawnNumbers = [];
                // 发送特定消息告知客户端所有数字已被抽取，进行重置
                ws.send(JSON.stringify({ message: "All numbers have been drawn. Resetting." }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
