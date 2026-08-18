const { app } = require('@azure/functions');
const { handleApiRequest } = require('../controllers/apiController.js');

app.http('publicApi', {
    methods: ['GET'],
    authLevel: 'function',
    route: '{endpoint?}/{actionOrCount?}',
    handler: async (request) => {
        const endpoint = request.params.endpoint;
        const actionOrCount = request.params.actionOrCount;
        const format = request.query.get('format');
        const fulltext = request.query.get('fulltext') === 'true';

        return handleApiRequest(endpoint, actionOrCount, format, fulltext);
    }
});
