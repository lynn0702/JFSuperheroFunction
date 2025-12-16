const { app } = require('@azure/functions');
const { 
    makeCharacter, 
    discordFormattedHero, 
    getMainCharacterDiscordString,
    getPowersetsDiscordString,
    getMilestonesDiscordString
} = require('../JFSuperheroes.js');

app.http('publicApi', {
    methods: ['GET'],
    authLevel: 'function',  // <--- SECURITY ENABLED
    route: '{endpoint}',    // <--- CAPTURES /api/hero, /api/about, etc.
    handler: async (request, context) => {
        const endpoint = request.params.endpoint.toLowerCase();
        const format = request.query.get('format'); 
        const fulltext = request.query.get('fulltext') === 'true'; 

        // 1. Handle "About"
        if (endpoint === 'about') {
            const text = "These characters are generated using a procedure designed by Jeremy Forbing.\n" +
                         "The process is outlined here: https://docs.google.com/document/d/1CiZwR1cMcBa1pUYRxXFFId9YfPmhqzO-JOQ8uLb4tCE\n" +
                         "All milestones are available here: https://docs.google.com/document/d/1GRVdMo7x-Q-8n7dFpiDr2Q9kK8YWGCJ8hbXeWSt10HY";
            
            return format === 'json' 
                ? { jsonBody: { content: text } } 
                : { body: text };
        }

        // 2. Generate Character
        const character = makeCharacter(true);

        // 3. Switch logic
        switch (endpoint) {
            case 'hero':
            case 'randomhero':
                if (format === 'text') {
                    if (fulltext) {
                        const part1 = getMainCharacterDiscordString(character);
                        const part2 = getPowersetsDiscordString(character);
                        const part3 = getMilestonesDiscordString(character);
                        return { body: part1 + "\n\n" + part2 + "\n\n" + part3 };
                    }
                    return { body: discordFormattedHero(true) };
                }
                return { jsonBody: character };

            case 'powersets':
                if (format === 'text') return { body: getPowersetsDiscordString(character) };
                return { jsonBody: character.powersets };

            case 'milestones':
                if (format === 'text') return { body: getMilestonesDiscordString(character) };
                return { jsonBody: character.milestones };

            case 'maincharacter':
                if (format === 'text') return { body: getMainCharacterDiscordString(character) };
                return { 
                    jsonBody: {
                        distinctions: character.distinctions,
                        affiliations: character.affiliations,
                        specialties: character.specialties
                    } 
                };

            default:
                return { 
                    status: 404, 
                    body: "Endpoint not found. Try: 'hero', 'powersets', 'milestones', 'maincharacter', or 'about'." 
                };
        }
    }
});