import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const OPENAI_MODEL = 'gpt-4o-mini';

const app = express();
let openai;

const VALID_MODES = [
  'Quick Reply',
  'Deep Thinking',
  'Step-by-Step Tutor',
  'Code Assistant',
  'Professional Polish'
];

const VALID_LENGTHS = ['Short', 'Medium', 'Long'];
const VALID_TONES = ['Direct', 'Beginner-friendly', 'Professional', 'Detailed', 'Casual'];

const SYSTEM_PROMPT = `You are PromptForge, an expert prompt optimization engine.

Your job is to rewrite rough user prompts into clear, useful, high-quality prompts for AI assistants.

You must preserve the user's original intent.
You must not invent specific facts, dates, names, requirements, or project details that the user did not provide.
When important information is missing, include clear placeholders in square brackets.

Optimize based on the selected mode:

Quick Reply:
- Make the prompt short, direct, and easy to answer.
- Ask for a concise response.
- Avoid unnecessary background or long reasoning.

Deep Thinking:
- Make the prompt detailed and structured.
- Ask the AI to reason carefully, consider tradeoffs, and give a thorough answer.
- Add context, constraints, assumptions, and requested output format when useful.

Step-by-Step Tutor:
- Make the prompt beginner-friendly.
- Ask the AI to teach slowly, explain concepts simply, include examples, and check understanding.
- Good for learning, studying, debugging, and technical topics.

Code Assistant:
- Make the prompt useful for programming help.
- Ask the AI to identify bugs, explain fixes, preserve existing behavior, and provide clean file-specific code when needed.
- Encourage minimal changes unless a refactor is clearly necessary.

Professional Polish:
- Make the prompt useful for polished writing.
- Ask the AI to improve clarity, tone, grammar, structure, and professionalism while preserving the user's voice.

Also consider:
- Desired response length: Short, Medium, or Long
- Desired tone: Direct, Beginner-friendly, Professional, Detailed, or Casual

Return JSON only in this exact format:
{
  "optimizedPrompt": "string",
  "score": number,
  "issues": ["string"],
  "improvements": ["string"]
}

Scoring rules:
Score the original prompt from 0 to 100 based on:
- clarity
- context
- constraints
- output format
- completeness`;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function cleanJsonText(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');
}

function validateResult(data) {
  return (
    data &&
    typeof data.optimizedPrompt === 'string' &&
    typeof data.score === 'number' &&
    Array.isArray(data.issues) &&
    Array.isArray(data.improvements)
  );
}

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openai;
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/optimize', async (request, response) => {
  // Validate and normalize user inputs before sending them to the AI engine.
  const prompt = typeof request.body.prompt === 'string' ? request.body.prompt.trim() : '';
  const mode = VALID_MODES.includes(request.body.mode) ? request.body.mode : 'Quick Reply';
  const length = VALID_LENGTHS.includes(request.body.length) ? request.body.length : 'Medium';
  const tone = VALID_TONES.includes(request.body.tone) ? request.body.tone : 'Direct';

  if (!prompt) {
    return response.status(400).json({ error: 'Prompt is required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({
      error: 'OPENAI_API_KEY is not configured. Create a server/.env file and restart the backend.'
    });
  }

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            roughPrompt: prompt,
            selectedMode: mode,
            desiredResponseLength: length,
            desiredTone: tone
          })
        }
      ],
      temperature: 0.35
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return response.status(502).json({ error: 'The AI returned an empty response.' });
    }

    let parsed;

    try {
      parsed = JSON.parse(cleanJsonText(rawContent));
    } catch {
      return response.status(502).json({
        error: 'The AI returned invalid JSON. Please try again with a clearer prompt.'
      });
    }

    if (!validateResult(parsed)) {
      return response.status(502).json({
        error: 'The AI response was missing required fields. Please try again.'
      });
    }

    response.json({
      optimizedPrompt: parsed.optimizedPrompt,
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      issues: parsed.issues.map(String),
      improvements: parsed.improvements.map(String)
    });
  } catch (error) {
    console.error('Prompt optimization failed:', error);
    response.status(500).json({
      error: 'Prompt optimization failed. Check your API key and try again.'
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`PromptForge API listening on http://${HOST}:${PORT}`);
});
