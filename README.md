# PromptForge
PromptForge is a full-stack AI prompt optimizer that turns rough ideas into clearer, stronger, and more useful prompts.
The app lets users choose how they want their prompt improved by selecting an optimization mode, response length, and tone. The React + Vite frontend sends the prompt to a Node/Express backend, which calls OpenAI and returns an optimized prompt, a quality score, issues found, and improvement notes.
## Features
- Optimize rough prompts into clearer AI-ready prompts
- Choose from multiple optimization modes:
  - Quick Reply
  - Deep Thinking
  - Step-by-Step Tutor
  - Code Assistant
  - Professional Polish
- Adjust the desired response length
- Select a tone such as direct, beginner-friendly, professional, detailed, or casual
- View a prompt quality score
- See issues found in the original prompt
- Review improvements made to the optimized prompt
- Copy the optimized prompt with one click
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

Getting Started

1. Install frontend dependencies

cd promptforge/client
npm install

2. Install backend dependencies

cd ../server
npm install

3. Create the backend environment file

cp .env.example .env

Then open server/.env and add your OpenAI API key:

OPENAI_API_KEY=your_real_api_key_here

Do not commit your real API key.

4. Run the backend

cd promptforge/server
npm run dev

The backend API runs at:

http://127.0.0.1:3001

5. Run the frontend

Open a second terminal:

cd promptforge/client
npm run dev

The app will run on the Vite URL shown in your terminal, usually:

http://localhost:5173

API

POST /api/optimize

Optimizes a rough prompt based on the selected mode, length, and tone.

Request Body

{
  "prompt": "string",
  "mode": "string",
  "length": "string",
  "tone": "string"
}

Example Response

{
  "optimizedPrompt": "string",
  "score": 85,
  "issues": ["string"],
  "improvements": ["string"]
}

Default Values

If values are missing, the backend uses these defaults:

mode: Quick Reply
length: Medium
tone: Direct

Notes

* CORS is enabled so the Vite frontend can call the Express backend.
* The backend reads the OpenAI API key from server/.env.
* The OpenAI model is stored in one constant, OPENAI_MODEL, inside server/index.js.
* If the AI response is empty, invalid JSON, or missing required fields, the server returns a helpful error instead of crashing.

Tech Stack

* React
* Vite
* Node.js
* Express
* OpenAI API

