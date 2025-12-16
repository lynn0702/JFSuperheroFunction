const { app } = require('@azure/functions');
const { verifyKey } = require('discord-interactions');

app.http('interactions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const signature = request.headers.get('x-signature-ed25519');
        const timestamp = request.headers.get('x-signature-timestamp');
        const rawBody = await request.text();
        const publicKey = process.env.DISCORD_PUBLIC_KEY;

        // --- DEBUG LOGS ---
        context.log(`1. Signature Length: ${signature ? signature.length : 'MISSING'}`);
        context.log(`2. Timestamp: ${timestamp}`);
        context.log(`3. Body Length: ${rawBody ? rawBody.length : 'EMPTY'}`);
        context.log(`4. Public Key Length: ${publicKey ? publicKey.length : 'MISSING'}`); 
        // ------------------

        if (!publicKey) {
            return { status: 500, body: 'Missing Public Key in Settings' };
        }

        const isValidRequest = await verifyKey(
            rawBody,
            signature,
            timestamp,
            publicKey
        );

        if (!isValidRequest) {
            context.log("❌ Signature Verification FAILED");
            return { status: 401, body: 'Bad request signature' };
        }

        context.log("✅ Signature Verification PASSED");
        
        // Return PONG (Type 1)
        const interaction = JSON.parse(rawBody);
        if (interaction.type === 1) {
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 1 })
            };
        }

        return { status: 404, body: 'Not implemented for test' };
    }
});