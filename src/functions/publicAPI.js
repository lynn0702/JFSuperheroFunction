const { app } = require('@azure/functions');
const { makeCharacter, discordFormattedHero, getMainCharacterDiscordString, getPowersetsDiscordString, getMilestonesDiscordString } = require('../../JFSuperheroes.js');

app.http('publicApi', {
    methods: ['GET'],
    authLevel: 'function',
    // The {count?} parameter is optional, so /api/hero and /api/hero/5 both work
    route: '{endpoint}/{count?}', 
    handler: async (request, context) => {
        const endpoint = request.params.endpoint.toLowerCase();
        const format = request.query.get('format');
        const fulltext = request.query.get('fulltext') === 'true';

        // 1. Handle "About" (Ignores count)
        if (endpoint === 'about') {
            const text = "These characters are generated using a procedure designed by Jeremy Forbing.\n" +
                         "The process is outlined here: https://docs.google.com/document/d/1CiZwR1cMcBa1pUYRxXFFId9YfPmhqzO-JOQ8uLb4tCE\n" +
                         "All milestones are available here: https://docs.google.com/document/d/1GRVdMo7x-Q-8n7dFpiDr2Q9kK8YWGCJ8hbXeWSt10HY";
            return format === 'json' ? { jsonBody: { content: text } } : { body: text };
        }

        // 2. Parse Count (Defaults to 1, safely caps at 100)
        let isMassCall = false;
        let count = 1;
        
        if (request.params.count) {
            isMassCall = true;
            count = parseInt(request.params.count);
            if (isNaN(count) || count < 1) count = 1;
            if (count > 100) count = 100;
        }

        const results = [];

        // 3. Generate Loop
        for (let i = 0; i < count; i++) {
            const character = makeCharacter(true);
            let resultItem;

            switch (endpoint) {
                case 'hero':
                case 'randomhero':
                    if (format === 'text') {
                        if (fulltext) {
                            const part1 = getMainCharacterDiscordString(character);
                            const part2 = getPowersetsDiscordString(character);
                            const part3 = getMilestonesDiscordString(character);
                            resultItem = part1 + "\n\n" + part2 + "\n\n" + part3;
                        } else {
                            resultItem = discordFormattedHero(true);
                        }
                    } else {
                        resultItem = character;
                    }
                    break;
                case 'powersets':
                    resultItem = format === 'text' ? getPowersetsDiscordString(character) : character.powersets;
                    break;
                case 'milestones':
                    resultItem = format === 'text' ? getMilestonesDiscordString(character) : character.milestones;
                    break;
                case 'maincharacter':
                    resultItem = format === 'text' ? getMainCharacterDiscordString(character) : {
                        distinctions: character.distinctions,
                        affiliations: character.affiliations,
                        specialties: character.specialties
                    };
                    break;
                default:
                    return { status: 404, body: "Endpoint not found. Try: 'hero', 'powersets', 'milestones', 'maincharacter', or 'about'." };
            }
            
            results.push(resultItem);
        }

        // 4. Return Data
        if (format === 'text') {
            // Join text results with a clear separator
            return { body: results.join('\n\n================================\n\n') };
        } else {
            // If they asked for a mass generation, return an array format. 
            // If they didn't specify a count, return a single object so we don't break existing integrations.
            if (isMassCall) {
                return { jsonBody: { totalGenerated: count, results: results } };
            } else {
                return { jsonBody: results[0] };
            }
        }
    }
});
