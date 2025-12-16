const {    makeCharacter,
    getMainCharacterDiscordString }  = require('../JFSuperheroes.js'); 

module.exports = {
    get data() {
        const { SlashCommandBuilder } = require('discord.js');
        return new SlashCommandBuilder()
		.setName('maincharacter')
		.setDescription('Gets a random set of distinctions, affiliations, and specialties.')
    },
    
	async execute(interaction) {
        let character = makeCharacter(true);
        await interaction.reply(getMainCharacterDiscordString(character));
	},
};