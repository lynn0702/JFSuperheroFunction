const { SlashCommandBuilder } = require('discord.js');
const { 
    makeCharacter,
    discordFormattedHero,
    getMainCharacterDiscordString,
    getPowersetsDiscordString,
    getMilestonesDiscordString
} = require("../JFSuperheroes.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomhero')
        .setDescription('Creates a random hero fit for use in Cortex Prime!')
        .addBooleanOption(option =>
            option
                .setName('fulltext')
                .setDescription('Include full details')),
    
    async execute(interaction) {
        // 1. Manually parse the option (since we don't have discord.js helpers here)
        // Checks if options exist, finds 'fulltext', and gets its value. Default to false.
        const fulltextOption = interaction.data.options?.find(opt => opt.name === 'fulltext');
        const fulltext = fulltextOption ? fulltextOption.value : false;

        if (fulltext) {
            let character = makeCharacter(true);
            
            // 2. Combine the three parts into one single message string
            // Note: Discord has a 2000 character limit. If this combined string exceeds it,
            // the command might fail. Usually, these generated heroes fit.
            const part1 = getMainCharacterDiscordString(character);
            const part2 = getPowersetsDiscordString(character);
            const part3 = getMilestonesDiscordString(character);
            
            return {
                content: part1 + "\n\n" + part2 + "\n\n" + part3
            };
        } else {
            // Standard short format
            return {
                content: discordFormattedHero(true)
            };
        }
    },
};