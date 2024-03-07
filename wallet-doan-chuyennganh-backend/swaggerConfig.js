import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Your API', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'API documentation for your application',
    },
  },
  // Path to the API docs
  apis: ['./routes/*.js'],
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
