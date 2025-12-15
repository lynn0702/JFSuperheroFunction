const { app } = require('@azure/functions');
const { verifyKey } = require('discord-interactions');
const fs = require('node:fs');
const path = require('node:path');

// Load commands into memory once when the function warms up
const commands = new Map();

try {
    // In Azure, the files are usually in the current working directory
    const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(process.cwd(), 'commands', file);
        const command = require(filePath);
        commands.set(command.data.name, command);
    }
} catch (error) {
    console.error("Warning: Could not load commands. This is expected during the initial PING if folders aren't synced yet.", error);
}

app.http('interactions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 1. Verify the Request
        const signature = request.headers.get('x-signature-ed25519');
        const timestamp = request.headers.get('x-signature-timestamp');
        const rawBody = await request.text();

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.DISCORD_PUBLIC_KEY
        );

        if (!isValidRequest) {
            context.log("Signature Verification FAILED");
            return { status: 401, body: 'Bad request signature' };
        }

        const interaction = JSON.parse(rawBody);

        // 2. Handle PING (Type 1)
        if (interaction.type === 1) {
            context.log("Returning PONG (Explicit)");
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: 1 })
            };
        }

        // 3. Handle Commands (Type 2)
        if (interaction.type === 2) {
            const commandName = interaction.data.name;
            const command = commands.get(commandName);

            if (!command) {
                return { status: 404, body: 'Command not found' };
            }

            try {
                const responseData = await command.execute(interaction);
                
                // Return explicit JSON response for commands too
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
                        data: responseData
                    })
                };
            } catch (error) {
                context.error(error);
                return {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 4,
                        data: { content: 'There was an error executing this command.' }
                    })
                };
            }
        }

        return { status: 404, body: 'Unknown interaction type' };
    }
});