const { app } = require('@azure/functions');
const { verifyKey } = require('discord-interactions');
const fs = require('node:fs');
const path = require('node:path');

// Global cache for commands (starts empty)
let commandsCache = null;

// Helper to load commands ONLY when needed
function getCommands() {
    if (commandsCache) return commandsCache;
    
    commandsCache = new Map();
    try {
        const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(process.cwd(), 'commands', file);
            const command = require(filePath);
            commandsCache.set(command.data.name, command);
        }
    } catch (error) {
        console.error("Command loading error:", error);
    }
    return commandsCache;
}

app.http('interactions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 1. Verify Request (Fastest check first)
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
            return { status: 401, body: 'Bad request signature' };
        }

        const interaction = JSON.parse(rawBody);

        // 2. Handle PING (INSTANT RETURN)
        // We return immediately without loading any files or commands
        if (interaction.type === 1) {
            return {
                status: 200,
                jsonBody: { type: 1 }
            };
        }

        // 3. Handle Commands (Load files now)
        if (interaction.type === 2) {
            const commands = getCommands(); // <--- Lazy load happens here
            const commandName = interaction.data.name;
            const command = commands.get(commandName);

            if (!command) {
                return { status: 404, body: 'Command not found' };
            }

            try {
                const responseData = await command.execute(interaction);
                return {
                    status: 200,
                    jsonBody: {
                        type: 4, 
                        data: responseData
                    }
                };
            } catch (error) {
                context.error(error);
                return {
                    status: 200,
                    jsonBody: {
                        type: 4,
                        data: { content: 'Error executing command' }
                    }
                };
            }
        }

        return { status: 404, body: 'Unknown interaction type' };
    }
});