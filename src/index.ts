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

// Resolve Frontend Path reliably
const frontendPath = path.join(__dirname, 'public');

// Swagger configuration with crash protection
let swaggerSpec = {};
try {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Insighta Labs API',
        version: '1.0.0',
      },
    },
    apis: ['./src/controllers/*.ts', './dist/controllers/*.js'],
  };
  swaggerSpec = swaggerJsdoc(swaggerOptions);
} catch (e) {
  console.error('Swagger Init Error:', e);
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Static Files (UI)
app.use(express.static(frontendPath));

// 2. API Routes
app.use('/api/profiles', profileRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. Health API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    db_connected: !!process.env.DATABASE_URL,
    ui_exists: fs.existsSync(path.join(frontendPath, 'index.html'))
  });
});

// 4. UI Catch-all
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  
  res.json({ status: 'success', message: 'API Live. UI files missing at ' + frontendPath });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
