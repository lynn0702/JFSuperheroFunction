const { app } = require('@azure/functions');
const { handleApiRequest } = require('../controllers/apiController.js');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-functions-key'
};

app.http('publicApi', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: '{endpoint?}/{actionOrCount?}',
    handler: async (request) => {
        // Handle CORS Preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 204,
                headers: corsHeaders
            };
        }

        const endpoint = request.params.endpoint;
        const actionOrCount = request.params.actionOrCount;
        const format = request.query.get('format');
        const fulltext = request.query.get('fulltext') === 'true';

        const response = handleApiRequest(endpoint, actionOrCount, format, fulltext);
        return {
            ...response,
            headers: {
                ...corsHeaders,
                ...(response.headers || {})
            }
        };
    }
});
