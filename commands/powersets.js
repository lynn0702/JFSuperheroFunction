const { SlashCommandBuilder } = require('discord.js');
const {    makeCharacter,
    getPowersetsDiscordString,
    } = require ('../JFSuperheroes.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('powersets')
		.setDescription('Gets powersets for a random hero.'),
	async execute(interaction) {
        let character = makeCharacter(true);
		return {
			content: getMilestonesDiscordString(character)
		};
	},
};