const {    
    makeCharacter,
    getPowersetsDiscordString,
} = require ('../JFSuperheroes.js');

module.exports = {
    get data() {
        const { SlashCommandBuilder } = require('discord.js');
        return new SlashCommandBuilder()
            .setName('powersets')
            .setDescription('Gets powersets for a random hero.');
    },
    async execute(interaction) {
        let character = makeCharacter(true);
        return {
            content: getPowersetsDiscordString(character)
        };
    },
};