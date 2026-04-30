# PromptForge

PromptForge is a full-stack MVP for turning rough ideas into stronger AI prompts. The React + Vite frontend lets a user choose an optimization mode, response length, and tone. The Node/Express backend calls OpenAI and returns an optimized prompt, score, issues, and improvement notes.

## Project Structure

```text
promptforge/
  client/
    src/
      App.jsx
      App.css
      main.jsx
    package.json
  server/
    index.js
    package.json
    .env.example
  README.md
```

## Setup

### 1. Install frontend dependencies

```bash
cd promptforge/client
npm install
```

### 2. Install backend dependencies

```bash
cd ../server
npm install
```

### 3. Create the backend environment file

```bash
cp .env.example .env
```

Then edit `server/.env`:

```bash
OPENAI_API_KEY=your_real_api_key_here
```

Do not commit your real API key.

### 4. Run the backend

```bash
cd promptforge/server
npm run dev
```

The API runs on `http://127.0.0.1:3001`.

### 5. Run the frontend

Open a second terminal:

```bash
cd promptforge/client
npm run dev
```

The app runs on the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API

### `POST /api/optimize`

Request body:

```json
{
  "prompt": "string",
  "mode": "string",
  "length": "string",
  "tone": "string"
}
```

Response body:

```json
{
  "optimizedPrompt": "string",
  "score": 85,
  "issues": ["string"],
  "improvements": ["string"]
}
```

Defaults:

- `mode`: `Quick Reply`
- `length`: `Medium`
- `tone`: `Direct`

## Notes

- CORS is enabled so the Vite frontend can call the Express backend.
- The backend uses `OPENAI_API_KEY` from `server/.env`.
- The OpenAI model is stored in one constant, `OPENAI_MODEL`, in `server/index.js`.
- If the AI response is empty, invalid JSON, or missing required fields, the server returns a useful error instead of crashing.
