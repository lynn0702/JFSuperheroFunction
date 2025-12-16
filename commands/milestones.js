const { makeCharacter, getMilestonesDiscordString } = require('../JFSuperheroes.js');

module.exports = {
    get data() {
        const { SlashCommandBuilder } = require('discord.js');
        return new SlashCommandBuilder()
            .setName('milestones')
            .setDescription('Gets milestones for a random hero.');
    },
    async execute(interaction) {
        let character = makeCharacter(true);
        return {
            content: getMilestonesDiscordString(character)
        };
    },
};