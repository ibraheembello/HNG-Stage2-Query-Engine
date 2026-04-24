import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import profileRoutes from './routes/profile.routes';
import { handleError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve Frontend Path
// This path is optimized for Vercel's cloud environment
const frontendPath = path.join(process.cwd(), 'dist', 'public');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. API Routes
app.use('/api/profiles', profileRoutes);

// 2. Health & Diagnostic API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    engine: 'Insighta Labs v1.1',
    db_connected: !!process.env.DATABASE_URL,
    ui: {
      checked: frontendPath,
      exists: fs.existsSync(frontendPath)
    }
  });
});

// 3. Static Files (UI)
app.use(express.static(frontendPath));

// 4. UI Catch-all handler
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({ 
    status: 'success', 
    message: 'Insighta Labs API is Online.',
    info: 'UI dashboard build not found. Verify deployment logs.'
  });
});

// 5. Global Error Protection
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Intelligence Engine starting on port ${PORT}`);
});
