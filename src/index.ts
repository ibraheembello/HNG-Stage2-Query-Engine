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

// Resolve Frontend Path to the ROOT public folder
const frontendPath = path.resolve(process.cwd(), 'public');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Health API (v1.3.0)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    version: '1.3.0-STABLE',
    db: !!process.env.DATABASE_URL,
    ui: {
      path: frontendPath,
      exists: fs.existsSync(frontendPath),
      index: fs.existsSync(path.join(frontendPath, 'index.html'))
    }
  });
});

// 2. Static Files
app.use(express.static(frontendPath));

// 3. API Routes
app.use('/api/profiles', profileRoutes);

// 4. Catch-all for UI
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({ 
    status: 'success', 
    version: '1.3.0',
    info: 'Frontend not found at ' + frontendPath
  });
});

// 5. Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`v1.3.0 Engine started on port ${PORT}`);
});
