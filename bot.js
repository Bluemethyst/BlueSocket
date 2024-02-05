const port = 8080;
const WebSocket = require("ws");
const fs = require("fs")
const path = require("path")
require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');

// pm2: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04#step-3-installing-pm2

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
	],
});

process.on('uncaughtException', (error) => {
    console.error('[ERR ]: ', error);
    sendToDiscord(`[ERR ]: ${error.message}`);
    process.exit(1);
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN // Replace with your actual bot token
const CHANNEL_ID = '1203429818142687293'; // The ID  of the Discord channel

client.login(DISCORD_BOT_TOKEN);

client.once('ready', () => {
    client.user.setActivity({
        name: 'on 51.161.9.63'
    })
    console.log('[RUN ]: Discord bot is ready!');
});

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

client.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Function to send a message to Discord
function sendToDiscord(content) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error(`Channel with ID ${CHANNEL_ID} not found.`);
        return;
    }
    channel.send(content);
}

const wss = new WebSocket.Server({ port: port });

wss.on("connection", (ws, req) => {
    console.log("[CONN]: Client Connected");
    sendToDiscord("[CONN]: Client Connected");
    // Check if the connection is a WebSocket upgrade request
    if (
        !req.headers.upgrade ||
        req.headers.upgrade.toLowerCase() !== "websocket"
    ) {
        console.log("[NOWS]: Non-WebSocket connection attempted");
        sendToDiscord("[NOWS]: Non-WebSocket connection attempted")
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
            sendToDiscord(`[MSG ]: ${message}`)
            return;
        }

        // Convert the parsed JSON object back to a string
        const messageString = JSON.stringify(parsedMessage);

        // Broadcast message to all clients except sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            } 
        });
        console.log("[JSON]:", messageString);
        sendToDiscord(`[JSON]: ${messageString}`)
    });

    ws.on("close", () => {
        console.log("[DISC]: Client Disconnected");
        sendToDiscord("[DISC]: Client Disconnected")
    });
});

console.log(`[RUN ]: WebSocket server started on port ${port}`);
sendToDiscord(`[RUN ]: WebSocket server started on port ${port}`);