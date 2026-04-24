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

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. API Routes
app.use('/api/profiles', profileRoutes);

// 2. Health & Debug API
app.get('/api/health', (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'public'),
    path.join(process.cwd(), 'public'),
    path.join(__dirname, 'public'),
    path.join(__dirname, '../dist/public')
  ];
  
  const debug = possiblePaths.map(p => ({
    path: p,
    exists: fs.existsSync(p),
    hasIndex: fs.existsSync(path.join(p, 'index.html'))
  }));

  res.json({ 
    status: 'success', 
    db_connected: !!process.env.DATABASE_URL,
    debug
  });
});

// 3. UI Serving with Auto-Discovery
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();
  
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'public'),
    path.join(process.cwd(), 'public'),
    path.join(__dirname, 'public'),
    path.join(__dirname, '../dist/public')
  ];

  for (const p of possiblePaths) {
    const indexPath = path.join(p, 'index.html');
    if (fs.existsSync(indexPath)) {
      app.use(express.static(p)); // Cache this path
      return res.sendFile(indexPath);
    }
  }

  res.json({ 
    status: 'success', 
    message: 'API is live. UI discovery failed.',
    cwd: process.cwd(),
    dirname: __dirname
  });
});

// 4. Safe Swagger
app.use('/api-docs', (req, res, next) => {
  try {
    const swaggerSpec = swaggerJsdoc({
      definition: { openapi: '3.0.0', info: { title: 'Insighta Labs API', version: '1.0.0' } },
      apis: ['./dist/controllers/*.js', './src/controllers/*.ts'],
    });
    return swaggerUi.serve[0](req, res, () => {
      swaggerUi.setup(swaggerSpec)(req, res, next);
    });
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Docs unavailable' });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
