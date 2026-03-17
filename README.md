# ai-meeting-scheduler

Schedule meetings in natural language. Send a message like "Book a 30-min call with John next Tuesday afternoon" and the AI handles availability check, conflict detection, invite sending, and confirmation — automatically.

## Demo

```
User: "Schedule a 1-hour strategy call with the team next Monday at 10am"
AI:   Checks all calendars for conflicts
AI:   "Monday 10am works for everyone. Sending invites now."
      -> Google Calendar invite sent to all attendees
      -> Confirmation message sent to user
```

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| AI | OpenAI GPT-4o (function calling) |
| Calendar | Google Calendar API |
| Auth | Google OAuth 2.0 |
| Storage | Supabase (Postgres) |
| Deploy | Railway |

## Features

- Natural language parsing: "next Tuesday at 3pm", "in 2 weeks", "morning slot"
- Multi-attendee availability checking
- Conflict detection across all calendars
- Automatic invite sending with description and agenda
- Timezone-aware scheduling
- Rescheduling and cancellation via chat
- Meeting reminder notifications

## Architecture

```
User message (natural language)
      |
      v
GPT-4o with function calling
      |
      +-- parse_datetime()     -> Extract date/time intent
      +-- check_availability() -> Google Calendar API
      +-- find_slot()          -> Conflict-free time finder
      +-- create_event()       -> Google Calendar API
      +-- send_confirmation()  -> Email/WhatsApp notification
```

## Setup

```bash
git clone https://github.com/haneiva1/ai-meeting-scheduler
cd ai-meeting-scheduler && npm install
cp .env.example .env
# Configure Google OAuth credentials + OpenAI key
npm run dev
```

## Environment Variables

```env
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
SUPABASE_URL=
SUPABASE_KEY=
PORT=3000
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | /auth/google | Start Google OAuth flow |
| GET | /auth/callback | OAuth callback handler |
| POST | /schedule | Schedule a meeting from natural language |
| GET | /meetings | List upcoming meetings |
| DELETE | /meetings/:id | Cancel a meeting |
| GET | /health | Health check |

## Example Request

```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Book a 30-min intro call with john@example.com tomorrow at 2pm"}'
```

```json
{
  "success": true,
  "event": {
    "id": "abc123",
    "summary": "Intro Call",
    "start": "2026-03-18T14:00:00-04:00",
    "end": "2026-03-18T14:30:00-04:00",
    "attendees": ["john@example.com"],
    "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
  }
}
```

---
Built by **Hans Aneiva** — AI automation developer, La Paz, Bolivia.
[haneivag@gmail.com](mailto:haneivag@gmail.com)