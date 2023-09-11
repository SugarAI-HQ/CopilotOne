import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from './root';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'Sugar Factory API',
    description: 'Prompt over apis',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000/api/',
    docsUrl: 'https://github.com/sugarcane-ai/factory',
    tags: ['prompts'],
});