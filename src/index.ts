import express from 'express';
import { authRouter } from './routes/auth';
import { scheduleRouter } from './routes/schedule';
import { config } from './config';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/', scheduleRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.listen(config.PORT, () => console.log('Server running on port ' + config.PORT));