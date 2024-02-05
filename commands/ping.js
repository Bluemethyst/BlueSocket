module.exports = {
    name: 'ping',
    description: 'Check the bot\'s latency',
    execute(interaction) {
        const ping = Math.round(interaction.client.ws.ping);
        interaction.reply(`Pong! Latency is ${ping}ms.`);
    },
};