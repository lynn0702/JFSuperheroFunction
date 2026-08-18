const { makeCharacter, discordFormattedHero, getMainCharacterDiscordString, getPowersetsDiscordString, getMilestonesDiscordString } = require('../../JFSuperheroes.js');

module.exports = {
    name: 'hero',
    aliases: ['randomhero'],
    description: 'Generates a full superhero profile including traits, powersets, and milestones.',
    parameters: {
        count: 'Optional number (1-100) appended to the path. Example: /api/hero/5',
        format: 'Query param (?format=text|json). Defaults to json.',
        fulltext: 'Query param (?fulltext=true). Expands all powers and distinctions when format=text.'
    },
    generate: ({ format, fulltext }) => {
        const character = makeCharacter(true);
        if (format === 'text') {
            if (fulltext) {
                return getMainCharacterDiscordString(character) + '\n\n' +
                       getPowersetsDiscordString(character) + '\n\n' +
                       getMilestonesDiscordString(character);
            }
            return discordFormattedHero(true);
        }
        return character;
    },
    getExample: () => ({
        endpoint: '/api/hero',
        description: 'Generates a full superhero profile including traits, powersets, and milestones.',
        supportedQueries: { format: ['json', 'text'], fulltext: ['true', 'false'] },
        sampleJsonOutput: makeCharacter(true)
    })
};
