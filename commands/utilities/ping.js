const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    async execute(interaction) {
        const ping = Math.round(interaction.client.ws.ping);
		await interaction.reply(`Pong! ${ping}`);
	},
};