const { app } = require('@azure/functions');
const { verifyKey, InteractionType, InteractionResponseType } = require('discord-interactions');
const fs = require('node:fs');
const path = require('node:path');

// Load commands into memory once when the function warms up
const commands = new Map();
const commandsPath = path.join(__dirname, '../../commands'); // Adjust path if needed based on your folder structure
// Note: In Azure Functions, __dirname might be different. 
// It is safer to put 'commands' folder at the root and require relatively.

// simple loader
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(process.cwd(), 'commands', file);
    const command = require(filePath);
    commands.set(command.data.name, command);
}

app.http('interactions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 1. Verify the Request (Mandatory for Webhooks)
        const signature = request.headers.get('x-signature-ed25519');
        const timestamp = request.headers.get('x-signature-timestamp');
        const rawBody = await request.text();

// Log the inputs to see what's happening
        context.log(`Signature: ${signature}`);
        context.log(`Timestamp: ${timestamp}`);
        context.log(`Public Key Present: ${!!process.env.DISCORD_PUBLIC_KEY}`); // True/False

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.DISCORD_PUBLIC_KEY
        );

        if (!isValidRequest) {
            context.log("Signature Verification FAILED"); // <--- Watch for this log
            return { status: 401, body: 'Bad request signature' };
        }
        
        context.log("Signature Verification PASSED"); // <--- Or this one

        const interaction = JSON.parse(rawBody);

        // 2. Handle PING (Discord checks this to verify your bot is alive)
        if (interaction.type === InteractionType.PING) {
            return {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: InteractionResponseType.PONG })
            };
        }

        // 3. Handle Commands
        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const commandName = interaction.data.name;
            const command = commands.get(commandName);

            if (!command) {
                return { status: 404, body: 'Command not found' };
            }

            try {
                // Execute the modified command logic
                const responseData = await command.execute(interaction);
                
                // Send response back to Discord
                return {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: responseData
                    })
                };
            } catch (error) {
                context.error(error);
                return {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { content: 'There was an error executing this command.' }
                    })
                };
            }
        }

        return { status: 404, body: 'Unknown interaction type' };
    }
});