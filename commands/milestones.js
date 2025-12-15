const { SlashCommandBuilder } = require('discord.js');
const { makeCharacter, getMilestonesDiscordString } = require('../JFSuperheroes.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('milestones')
		.setDescription('Gets powersets for a random hero.'),
	async execute(interaction) {
		let character = makeCharacter(true);
		return {
			content: getMilestonesDiscordString(character)
		};
	},
};