module.exports = {
    name: 'about',
    description: 'Returns information about the JF Superhero Generator and links to the source rules.',
    parameters: {
        format: 'Query param (?format=text|json). Defaults to json.'
    },
    generate: ({ format }) => {
        const text = "These characters are generated using a procedure designed by Jeremy Forbing.\n" +
                     "The process is outlined here: https://docs.google.com/document/d/1CiZwR1cMcBa1pUYRxXFFId9YfPmhqzO-JOQ8uLb4tCE\n" +
                     "All milestones are available here: https://docs.google.com/document/d/1GRVdMo7x-Q-8n7dFpiDr2Q9kK8YWGCJ8hbXeWSt10HY";
        
        if (format === 'text') {
            return text;
        }
        return { content: text };
    },
    getExample: () => ({
        endpoint: '/api/about',
        description: 'Returns information about the JF Superhero Generator and links to the source rules.',
        supportedQueries: { format: ['json', 'text'] },
        sampleJsonOutput: {
            content: "These characters are generated using a procedure designed by Jeremy Forbing.\nThe process is outlined here: https://docs.google.com/document/d/1CiZwR1cMcBa1pUYRxXFFId9YfPmhqzO-JOQ8uLb4tCE\nAll milestones are available here: https://docs.google.com/document/d/1GRVdMo7x-Q-8n7dFpiDr2Q9kK8YWGCJ8hbXeWSt10HY"
        }
    })
};
