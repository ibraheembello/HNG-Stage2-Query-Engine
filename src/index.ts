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

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Static Files (UI)
app.use(express.static(frontendPath));

// 2. API Routes
app.use('/api/profiles', profileRoutes);

// 3. Health API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    db_connected: !!process.env.DATABASE_URL 
  });
});

// 4. Safe Swagger (Only loads when clicked)
app.use('/api-docs', (req, res, next) => {
  try {
    const swaggerSpec = swaggerJsdoc({
      definition: {
        openapi: '3.0.0',
        info: { title: 'Insighta Labs API', version: '1.0.0' },
      },
      // Fixed: Explicitly target files to prevent EISDIR crash
      apis: ['./dist/controllers/*.js', './src/controllers/*.ts'],
    });
    return swaggerUi.serve[0](req, res, () => {
      swaggerUi.setup(swaggerSpec)(req, res, next);
    });
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Docs unavailable' });
  }
});

// 5. Bulletproof Catch-all (No path strings to avoid Vercel PathError)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({ status: 'success', message: 'API is live. UI not bundled correctly.' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
