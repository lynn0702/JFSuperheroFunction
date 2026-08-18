const { app } = require('@azure/functions');
const { handleApiRequest } = require('../controllers/apiController.js');

app.http('publicApi', {
    methods: ['GET'],
    authLevel: 'function',
    // Both {endpoint?} and {count?} are optional now to allow root API calls to hit the 404 docs
    route: '{endpoint?}/{count?}',
    handler: async (request, context) => {
        // Default to a blank string if no endpoint is provided, which triggers the 404 docs
        const endpoint = request.params.endpoint ? request.params.endpoint.toLowerCase() : '';
        const format = request.query.get('format');
        const fulltext = request.query.get('fulltext') === 'true';

        // Parse and clamp the count safely
        let count = 1;
        if (request.params.count) {
            count = parseInt(request.params.count);
            if (isNaN(count) || count < 1) count = 1;
            if (count > 100) count = 100;
        }

        // Pass the sanitized parameters to the controller
        return handleApiRequest(endpoint, count, format, fulltext);
    }
});
