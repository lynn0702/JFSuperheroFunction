const { makeCharacter, getMainCharacterDiscordString } = require('../../JFSuperheroes.js');

module.exports = {
    name: 'maincharacter',
    description: 'Generates base stats including distinctions, affiliations, and specialties.',
    parameters: {
        count: 'Optional number (1-100) appended to the path. Example: /api/maincharacter/5',
        format: 'Query param (?format=text|json). Defaults to json.'
    },
    generate: ({ format }) => {
        const character = makeCharacter(true);
        if (format === 'text') {
            return getMainCharacterDiscordString(character);
        }
        return {
            distinctions: character.distinctions,
            affiliations: character.affiliations,
            specialties: character.specialties
        };
    },
    getExample: () => {
        // Generate a sample character to extract just the base stats
        const character = makeCharacter(true);
        return {
            endpoint: '/api/maincharacter',
            description: 'Generates base stats including distinctions, affiliations, and specialties.',
            supportedQueries: { format: ['json', 'text'] },
            sampleJsonOutput: {
                distinctions: character.distinctions,
                affiliations: character.affiliations,
                specialties: character.specialties
            }
        };
    }
};
