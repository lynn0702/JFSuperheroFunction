const { makeCharacter, getPowersetsDiscordString } = require('../../JFSuperheroes.js');

module.exports = {
    name: 'powersets',
    description: 'Generates power sets including traits, limits, and SFX.',
    parameters: {
        count: 'Optional number (1-100) appended to the path. Example: /api/powersets/5',
        format: 'Query param (?format=text|json). Defaults to json.'
    },
    generate: ({ format }) => {
        const character = makeCharacter(true);
        if (format === 'text') {
            return getPowersetsDiscordString(character);
        }
        return character.powersets;
    },
    getExample: () => ({
        endpoint: '/api/powersets',
        description: 'Generates power sets including traits, limits, and SFX.',
        supportedQueries: { format: ['json', 'text'] },
        sampleJsonOutput: makeCharacter(true).powersets
    })
};
