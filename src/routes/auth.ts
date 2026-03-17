import { Router } from 'express';
import { google } from 'googleapis';
import { config } from '../config';
import { saveTokens } from '../services/storage';

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

export const authRouter = Router();

authRouter.get('/google', (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(url);
});

authRouter.get('/callback', async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.status(400).json({ error });
  const { tokens } = await oauth2Client.getToken(code);
  await saveTokens(tokens);
  res.json({ success: true, message: 'Calendar connected!' });
});