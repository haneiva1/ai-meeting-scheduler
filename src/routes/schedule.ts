import { Router } from 'express';
import { scheduleMeeting, listMeetings, cancelMeeting } from '../services/scheduler';

export const scheduleRouter = Router();

scheduleRouter.post('/schedule', async (req, res) => {
  try {
    const { message, userEmail } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });
    const result = await scheduleMeeting(message, userEmail);
    res.json({ success: true, event: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

scheduleRouter.get('/meetings', async (_req, res) => {
  const meetings = await listMeetings();
  res.json({ meetings });
});

scheduleRouter.delete('/meetings/:id', async (req, res) => {
  await cancelMeeting(req.params.id);
  res.json({ success: true });
});