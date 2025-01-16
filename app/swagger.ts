import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Job Board API", // API title
      version: "1.0.0", // API version
      description: "A RESTful API for job applications, job postings, and user authentication",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/**/*.ts", "./controllers/**/*.ts"], // Paths to all routes and controller files
};

// Initialize Swagger documentation
const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (router: Router) => {
  // Serve Swagger UI documentation at /docs
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
