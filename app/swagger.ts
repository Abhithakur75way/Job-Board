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
  apis: [
    "./app/employer/job.routes.ts", // Employer routes
    "./app/user/user.routes.ts", // User routes
  ],
};

// Initialize Swagger documentation
const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (router: Router) => {
  // Serve Swagger UI documentation at /docs
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Optional: Serve raw JSON spec at /docs.json
  router.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
