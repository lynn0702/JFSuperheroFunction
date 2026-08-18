const { getEndpoint, getAllEndpointsSummary } = require('../endpoints/index.js');

function handleApiRequest(endpointName, secondParam, format, fulltext) {
    const handler = getEndpoint(endpointName);

    if (!handler) {
        return { status: 404, jsonBody: getAllEndpointsSummary() };
    }

    // 1. Handle Example Request: /api/hero/example
    if (secondParam?.toLowerCase() === 'example') {
        return {
            status: 200,
            jsonBody: handler.getExample ? handler.getExample() : { description: handler.description }
        };
    }

    // 2. Parse Mass Generation Count
    let count = 1;
    if (secondParam) {
        count = parseInt(secondParam, 10);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 100) count = 100;
    }

    // 3. Generate Results
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(handler.generate({ format, fulltext }));
    }

    if (format === 'text') {
        return { status: 200, body: results.join('\n\n================================\n\n') };
    }

    return {
        status: 200,
        jsonBody: count > 1 ? { totalGenerated: count, results } : results[0]
    };
}

module.exports = { handleApiRequest };
