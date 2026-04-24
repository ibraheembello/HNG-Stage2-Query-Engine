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
const frontendPath = path.join(__dirname, 'public');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Static Files (UI) - Must be first
app.use(express.static(frontendPath));

// 2. API Routes
app.use('/api/profiles', profileRoutes);

// 3. Lazy Swagger (Prevents startup crash)
app.use('/api-docs', (req, res, next) => {
  try {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'Insighta Labs API', version: '1.0.0' },
      },
      apis: ['./src/controllers/*.ts', './dist/controllers/*.js'],
    };
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    return swaggerUi.serve[0](req, res, () => {
      swaggerUi.setup(swaggerSpec)(req, res, next);
    });
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Swagger load error' });
  }
});

// 4. Simple Health API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Intelligence Query Engine is running',
    db_connected: !!process.env.DATABASE_URL
  });
});

// 5. UI Catch-all
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.json({ status: 'success', message: 'API Live. UI not found.' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
