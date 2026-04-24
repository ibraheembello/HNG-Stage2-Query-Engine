import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.routes';
import { handleError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/profiles', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'STABILITY TEST v3.0 - SWAGGER REMOVED',
    db: !!process.env.DATABASE_URL
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'If you see this, the 500 error is FIXED.' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Stability server started on port ${PORT}`);
});
