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

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/profiles', profileRoutes);

app.get('/api/health', (req, res) => {
  const rootDir = process.cwd();
  const dirFiles = (dir: string): string[] => {
    try {
      return fs.readdirSync(dir).map(f => {
        const p = path.join(dir, f);
        return fs.statSync(p).isDirectory() ? `${f}/` : f;
      });
    } catch (e) { return [String(e)]; }
  };

  res.json({ 
    status: 'success', 
    version: '1.4.0-DIAGNOSTIC',
    cwd: rootDir,
    dirname: __dirname,
    root_listing: dirFiles(rootDir),
    src_listing: dirFiles(path.join(rootDir, 'src')),
    dist_listing: dirFiles(path.join(rootDir, 'dist')),
  });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.json({ status: 'success', message: 'Diagnostic Mode Active. Visit /api/health' });
});

app.listen(PORT, () => {
  console.log(`Diagnostic server started on port ${PORT}`);
});
