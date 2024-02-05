const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription('Gives IP Information'),
	async execute(interaction) {
		await interaction.reply('IP: 51.161.9.63\nDomain: ws.bluemethyst.dev\nWebsocket: ws://ws.bluemethyst.dev:8080');
	},
};