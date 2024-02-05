module.exports = {
    name: 'ip',
    description: 'Returns ip address info',
    execute(interaction) {
        interaction.reply('IP: 51.161.9.63\nDomain: ws.bluemethyst.dev\nWebsocket: ws://ws.bluemethyst.dev:8080');
    },
};