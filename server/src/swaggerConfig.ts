import swaggerJSDoc from "swagger-jsdoc";
import { PORT } from "./config";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Support System VSA",
      version: "1.0.0", // Version of the API
      description: "API Documentation with Swagger in Node.js and TypeScript",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // API base URL
        description: "Support System Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, just to indicate that the token is a JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply this globally for all endpoints
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your API docs
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
