const hero = require('./hero.js');
const powersets = require('./powersets.js');
const milestones = require('./milestones.js');
const maincharacter = require('./maincharacter.js');
const about = require('./about.js');

const endpointList = [hero, powersets, milestones, maincharacter, about];

// Map endpoints by primary name and aliases
const endpointMap = new Map();
endpointList.forEach(mod => {
    endpointMap.set(mod.name.toLowerCase(), mod);
    if (mod.aliases) {
        mod.aliases.forEach(alias => endpointMap.set(alias.toLowerCase(), mod));
    }
});

function getEndpoint(name) {
    return endpointMap.get(name?.toLowerCase());
}

function getAllEndpointsSummary() {
    return {
        error: 'Endpoint not found.',
        message: 'Welcome to the JF Superhero Generator API! Valid endpoints and examples are listed below.',
        endpoints: endpointList.map(mod => ({
            name: mod.name,
            aliases: mod.aliases || [],
            description: mod.description,
            exampleUrl: `/api/${mod.name}/example`
        }))
    };
}

module.exports = { getEndpoint, getAllEndpointsSummary };
