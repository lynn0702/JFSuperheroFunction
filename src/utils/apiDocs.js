const { makeCharacter } = require('../../JFSuperheroes.js');

function get404Documentation() {
    return {
        error: "Endpoint not found.",
        message: "Welcome to the JF Superhero Generator API! Please use one of the valid endpoints below.",
        validEndpoints: [
            "hero",
            "randomhero",
            "powersets",
            "milestones",
            "maincharacter",
            "about"
        ],
        usageOptions: {
            massGeneration: "Append a number (up to 100) to the route to generate multiple results. Example: /api/hero/5",
            formatting: "Add ?format=text to the query string for Discord-formatted markdown. For full hero details, use ?format=text&fulltext=true."
        },
        sampleOutput: makeCharacter(true) // Generates a fresh example every time they hit the 404!
    };
}

module.exports = { get404Documentation };
