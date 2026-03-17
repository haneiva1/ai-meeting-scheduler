import OpenAI from 'openai';
import { google } from 'googleapis';
import { config } from '../config';
import { getTokens } from './storage';

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_calendar_event',
      description: 'Create a Google Calendar event',
      parameters: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'Meeting title' },
          startDateTime: { type: 'string', description: 'ISO 8601 datetime' },
          endDateTime: { type: 'string', description: 'ISO 8601 datetime' },
          attendees: { type: 'array', items: { type: 'string' }, description: 'Email addresses' },
          description: { type: 'string', description: 'Meeting agenda or notes' },
        },
        required: ['summary', 'startDateTime', 'endDateTime'],
      },
    },
  },
];

export async function scheduleMeeting(message: string, userEmail?: string) {
  const now = new Date().toISOString();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a meeting scheduler. Current time: ' + now + '. Parse the user request and call create_calendar_event with the correct parameters. Default duration 30 min if not specified.' },
      { role: 'user', content: message }
    ],
    tools,
    tool_choice: 'auto',
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];
  if (!toolCall) throw new Error('Could not parse meeting details from message');

  const args = JSON.parse(toolCall.function.arguments);
  return createGoogleEvent(args);
}

async function createGoogleEvent(args: any) {
  const tokens = await getTokens();
  const auth = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
  auth.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth });
  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: args.summary,
      description: args.description,
      start: { dateTime: args.startDateTime, timeZone: 'America/La_Paz' },
      end: { dateTime: args.endDateTime, timeZone: 'America/La_Paz' },
      attendees: args.attendees?.map((e: string) => ({ email: e })),
      conferenceData: { createRequest: { requestId: Math.random().toString(36) } },
    },
  });
  return data;
}

export async function listMeetings() {
  const tokens = await getTokens();
  const auth = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
  auth.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth });
  const { data } = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 20,
    orderBy: 'startTime',
    singleEvents: true,
  });
  return data.items || [];
}

export async function cancelMeeting(eventId: string) {
  const tokens = await getTokens();
  const auth = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
  auth.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth });
  await calendar.events.delete({ calendarId: 'primary', eventId });
}