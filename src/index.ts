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

// Resolve Frontend Path
const frontendPath = path.join(process.cwd(), 'dist', 'public');
const fallbackFrontendPath = path.join(process.cwd(), 'src', 'public');
const activePublicPath = fs.existsSync(frontendPath) ? frontendPath : fallbackFrontendPath;

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
  // FIXED: Specific file paths to prevent EISDIR crash
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

// 1. Static Files (High Priority)
app.use(express.static(activePublicPath));

// 2. API Routes
app.use('/api/profiles', profileRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. Specific Health API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Intelligence Query Engine is running',
    db_connected: !!process.env.DATABASE_URL
  });
});

// 4. Catch-all for UI
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }

  const indexPath = path.join(activePublicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.json({ 
    status: 'success', 
    message: 'Insighta Labs API is Live.',
    info: 'UI not found. Please verify the build process.',
    debug: { path: activePublicPath }
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
