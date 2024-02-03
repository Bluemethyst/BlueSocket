const port = 8080;
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: port });

wss.on("connection", (ws, req) => {
    console.log("[CONN]: Client Connected");
    // Check if the connection is a WebSocket upgrade request
    if (
        !req.headers.upgrade ||
        req.headers.upgrade.toLowerCase() !== "websocket"
    ) {
        console.log("[NOWS]: Non-WebSocket connection attempted");
        ws.close();
        return;
    }
    ws.on("message", (message) => {
        // Check if the message is a valid JSON string
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            console.error("[MSG ]:", message);
            return;
        }

        // Convert the parsed JSON object back to a string
        const messageString = JSON.stringify(parsedMessage);

        // Broadcast message to all clients except sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
                console.log("[JSON]:", messageString);
            }
        });
    });

    ws.on("close", () => {
        console.log("[DISC]: Client Disconnected");
    });
});

console.log(`[RUN ]: WebSocket server started on port ${port}`);
