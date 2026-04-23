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

// Critical Check: Ensure Database URL exists
if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL environment variable is missing.');
}

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
  apis: [
    path.join(__dirname, '../src/controllers/*.ts'),
    path.join(__dirname, '../src/routes/*.ts'),
    path.join(__dirname, './controllers/*.js')
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
    documentation: '/api-docs',
    db_connected: !!process.env.DATABASE_URL
  });
});

// Resolve Frontend Path reliably for Vercel
// In Vercel serverless, __dirname is the directory of the entry point (src/)
const frontendPath = path.join(process.cwd(), 'frontend', 'dist');

// Serve static files if they exist
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Catch-all to serve Frontend UI for any non-API routes
app.get('*', (req, res, next) => {
  // Don't intercept API calls
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // Fallback if UI is not built or path is wrong
  res.json({ 
    status: 'success', 
    message: 'Insighta Labs API is Live.',
    ui_status: 'Frontend build not found at ' + frontendPath,
    documentation: '/api-docs'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
