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
const frontendPath = path.join(process.cwd(), 'dist', 'public');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. API Routes
app.use('/api/profiles', profileRoutes);

// 2. Health & Diagnostic API (v1.2 Force Update)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    version: '1.2.0-FINAL',
    db_connected: !!process.env.DATABASE_URL,
    ui: {
      path: frontendPath,
      exists: fs.existsSync(frontendPath)
    }
  });
});

// 3. Static Files (UI)
app.use(express.static(frontendPath));

// 4. UI Catch-all handler (NO STRING WILDCARDS to prevent PathError)
app.use((req: any, res: any, next: any) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({ 
    status: 'success', 
    message: 'Insighta Labs v1.2 is Online.',
    info: 'UI dashboard build folder not found. Check Vercel build logs.',
    checked_path: frontendPath
  });
});

// 5. Global Error Protection
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Intelligence Engine v1.2 starting on port ${PORT}`);
});
