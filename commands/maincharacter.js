const { get_main_character } = require('../JFSuperheroes'); 

module.exports = {
    get data() {
        const { SlashCommandBuilder } = require('discord.js');
        return new SlashCommandBuilder()
            .setName('maincharacter')
            .setDescription('Generates a Main Character!');
    },
    
    async execute(interaction) {
        const result = get_main_character();
        
        return {
            content: result
        };
    },
};