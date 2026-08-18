const { makeCharacter, getMilestonesDiscordString } = require('../../JFSuperheroes.js');

module.exports = {
    name: 'milestones',
    description: 'Generates character milestones and XP triggers.',
    parameters: {
        count: 'Optional number (1-100) appended to the path. Example: /api/milestones/5',
        format: 'Query param (?format=text|json). Defaults to json.'
    },
    generate: ({ format }) => {
        const character = makeCharacter(true);
        if (format === 'text') {
            return getMilestonesDiscordString(character);
        }
        return character.milestones;
    },
    getExample: () => ({
        endpoint: '/api/milestones',
        description: 'Generates character milestones and XP triggers.',
        supportedQueries: { format: ['json', 'text'] },
        sampleJsonOutput: makeCharacter(true).milestones
    })
};
