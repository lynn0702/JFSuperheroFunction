module.exports = {
    get data() {
        const { SlashCommandBuilder } = require('discord.js');
        return new SlashCommandBuilder()
            .setName('about')
            .setDescription('Links for supporting documents.');
    },
async execute(interaction) {
    return {
        content:
            "These characters are generated using a procedure designed by Jeremy Forbing."
            +"\nThe process is outlined here: https://docs.google.com/document/d/1CiZwR1cMcBa1pUYRxXFFId9YfPmhqzO-JOQ8uLb4tCE"
            +"\nAll milestones are available here: https://docs.google.com/document/d/1GRVdMo7x-Q-8n7dFpiDr2Q9kK8YWGCJ8hbXeWSt10HY"
	};
}
}