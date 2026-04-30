# PromptForge

PromptForge is a full-stack AI prompt optimizer that turns rough ideas into clearer, stronger, and more useful prompts.

Users can choose an optimization mode, response length, and tone to control how their prompt is improved. The React + Vite frontend sends the prompt to a Node/Express backend, which calls OpenAI and returns an optimized prompt, a quality score, issues found, and improvement notes.

---

## Features

- Optimize rough prompts into AI-ready prompts
- Choose from different optimization modes
- Adjust response length
- Select the desired tone
- View a prompt quality score
- See issues found in the original prompt
- Review improvements made to the optimized prompt
- Copy the optimized prompt with one click

---

## Optimization Modes

| Mode | Purpose |
|---|---|
| Quick Reply | Creates a short, direct prompt for fast answers |
| Deep Thinking | Creates a more detailed prompt for thoughtful responses |
| Step-by-Step Tutor | Creates a beginner-friendly prompt for learning |
| Code Assistant | Creates a coding-focused prompt for debugging or development help |
| Professional Polish | Creates a polished prompt for emails, resumes, reports, and professional writing |

---

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| AI | OpenAI API |
| Styling | CSS |
| Environment Variables | dotenv |

---

## Project Structure

```text
promptforge/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lucas5monts/Prompt-Optimizer.git
cd Prompt-Optimizer
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Create the backend environment file

Inside the `server` folder, create a `.env` file:

```bash
cp .env.example .env
```

Then add your OpenAI API key:

```env
OPENAI_API_KEY=your_real_api_key_here
```

Do not commit your real API key.

### 5. Run the backend

From the `server` folder:

```bash
npm run dev
```

The backend API runs at:

```text
http://127.0.0.1:3001
```

### 6. Run the frontend

Open another terminal from the project root and run:

```bash
cd client
npm run dev
```

The app will run on the Vite URL shown in your terminal, usually:

```text
http://localhost:5173
```

---

## API

### POST `/api/optimize`

Optimizes a rough prompt based on the selected mode, length, and tone.

### Request Body

```json
{
  "prompt": "Explain recursion to me",
  "mode": "Step-by-Step Tutor",
  "length": "Medium",
  "tone": "Beginner-friendly"
}
```

### Example Response

```json
{
  "optimizedPrompt": "Explain recursion in a beginner-friendly way. Start with a simple definition, then use a real-world analogy, followed by a small code example. Keep the explanation clear and step-by-step.",
  "score": 85,
  "issues": [
    "The original prompt was too broad.",
    "The original prompt did not specify the desired explanation style."
  ],
  "improvements": [
    "Added a beginner-friendly tone.",
    "Added a step-by-step structure.",
    "Requested an example to make the concept easier to understand."
  ]
}
```

### Default Values

If values are missing, the backend uses these defaults:

```text
mode: Quick Reply
length: Medium
tone: Direct
```

---

## Notes

- CORS is enabled so the Vite frontend can call the Express backend.
- The backend reads the OpenAI API key from `server/.env`.
- The OpenAI model is stored in one constant called `OPENAI_MODEL` inside `server/index.js`.
- If the AI response is empty, invalid JSON, or missing required fields, the server returns a helpful error instead of crashing.

---

## Future Improvements

- Add user accounts
- Save prompt history
- Add favorite prompts
- Add more optimization templates
- Add a browser extension version
- Add side-by-side before and after comparison
- Add export options for saved prompts