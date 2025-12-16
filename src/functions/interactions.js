const { app } = require('@azure/functions');
const { verifyKey } = require('discord-interactions');

// 1. Import your commands directly
const randomHero = require('../../commands/randomhero.js');
const mainCharacter = require('../../commands/maincharacter.js');
const powersets = require('../../commands/powersets.js');
const milestones = require('../../commands/milestones.js');
const about = require('../../commands/about.js');

// 2. Map command names to their modules
const commands = {
    randomhero: randomHero,
    maincharacter: mainCharacter,
    powersets: powersets,
    milestones: milestones,
    about: about
};

app.http('interactions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const signature = request.headers.get('x-signature-ed25519');
        const timestamp = request.headers.get('x-signature-timestamp');
        const rawBody = await request.text();
        const publicKey = process.env.DISCORD_PUBLIC_KEY;

        if (!publicKey) return { status: 500, body: 'Missing Public Key' };

        const isValidRequest = await verifyKey(rawBody, signature, timestamp, publicKey);
        if (!isValidRequest) return { status: 401, body: 'Bad request signature' };

        const interaction = JSON.parse(rawBody);

        // --- Handle PING (Type 1) ---
        if (interaction.type === 1) {
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 1 })
            };
        }

        // --- Handle COMMANDS (Type 2) ---
        if (interaction.type === 2) {
            const { name } = interaction.data;
            const command = commands[name];

            if (command) {
                try {
                    // Execute the command logic
                    // Your generation logic is fast (<100ms), so we use Type 4 (Immediate Reply)
                    const result = await command.execute(interaction);

                    return {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
                            data: result
                        })
                    };
                } catch (error) {
                    context.error(`Error executing ${name}:`, error);
                    return {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 4,
                            data: { content: "There was an error while executing this command!" }
                        })
                    };
                }
            }
        }

        return { status: 404, body: 'Command not found' };
    }
});