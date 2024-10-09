import swaggerJSDoc from "swagger-jsdoc";
import { PORT } from "./config";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Support System VSA",
      version: "1.0.0",
      description: "API Documentation with Swagger in Node.js and TypeScript",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Support System Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/apiRouter.ts"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
