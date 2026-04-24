import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import profileRoutes from './routes/profile.routes';
import { handleError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Insighta Labs - Intelligence Query Engine API',
      version: '1.0.0',
      description: 'Demographic intelligence API with filtering, sorting, and NL query support.',
    },
    servers: [
      {
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`,
      },
    ],
  },
  // FIXED: Precise file patterns to prevent EISDIR errors on Vercel
  apis: [
    './dist/controllers/*.js',
    './dist/routes/*.js',
    './src/controllers/*.ts',
    './src/routes/*.ts'
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/profiles', profileRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Intelligence Query Engine is running',
    db_connected: !!process.env.DATABASE_URL
  });
});

// Resolve Frontend Path
const frontendPath = path.join(process.cwd(), 'dist', 'public');

// Serve static files
app.use(express.static(frontendPath));

// catch-all handler for the UI (Middleware mode for stability)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }

  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.json({ 
    status: 'success', 
    message: 'Insighta Labs API is Live.',
    debug: {
      checked_path: frontendPath,
      exists: fs.existsSync(frontendPath),
      documentation: '/api-docs'
    }
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
