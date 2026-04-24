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

// Resolve Frontend Path reliably
const frontendPath = path.join(process.cwd(), 'dist', 'public');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Static Files (UI)
app.use(express.static(frontendPath));

// 2. API Routes
app.use('/api/profiles', profileRoutes);

// 3. Simple Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    db_connected: !!process.env.DATABASE_URL,
    ui_discovery: {
      path: frontendPath,
      exists: fs.existsSync(frontendPath),
      index: fs.existsSync(path.join(frontendPath, 'index.html'))
    }
  });
});

// 4. Bulletproof Catch-all for UI
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({ 
    status: 'success', 
    message: 'Insighta Labs API is Live.',
    info: 'UI distribution folder not found. Path: ' + frontendPath
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
