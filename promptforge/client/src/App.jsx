import { useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

const MODES = [
  {
    value: 'Quick Reply',
    label: 'Quick Reply',
    description: 'Short, direct prompts for fast answers.'
  },
  {
    value: 'Deep Thinking',
    label: 'Deep Thinking',
    description: 'Structured prompts for careful analysis.'
  },
  {
    value: 'Step-by-Step Tutor',
    label: 'Step-by-Step Tutor',
    description: 'Clear, beginner-friendly teaching prompts.'
  },
  {
    value: 'Code Assistant',
    label: 'Code Assistant',
    description: 'Focused programming and debugging prompts.'
  },
  {
    value: 'Professional Polish',
    label: 'Professional Polish',
    description: 'Refined prompts for polished writing.'
  }
];

const LENGTHS = ['Short', 'Medium', 'Long'];
const TONES = ['Direct', 'Beginner-friendly', 'Professional', 'Detailed', 'Casual'];

function App() {
  // Main prompt controls sent to the backend optimizer.
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('Quick Reply');
  const [length, setLength] = useState('Medium');
  const [tone, setTone] = useState('Direct');

  // Request and result state for loading, errors, copy feedback, and output.
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedMode = useMemo(
    () => MODES.find((item) => item.value === mode),
    [mode]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    if (!prompt.trim()) {
      setError('Paste a rough prompt first.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, mode, length, tone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to optimize the prompt.');
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  async function copyOptimizedPrompt() {
    if (!result?.optimizedPrompt) return;

    await navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">AI prompt optimizer</p>
          <h1>PromptForge</h1>
          <p className="subtitle">Turn rough ideas into better AI prompts.</p>
        </div>
      </section>

      <section className="workspace">
        <form className="panel input-panel" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="prompt">
            Rough prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: help me make a study plan for learning JavaScript"
            rows={10}
          />

          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="mode">
                Optimization Mode
              </label>
              <select id="mode" value={mode} onChange={(event) => setMode(event.target.value)}>
                {MODES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="hint">{selectedMode?.description}</p>
            </div>

            <div>
              <label className="field-label" htmlFor="length">
                Response Length
              </label>
              <select id="length" value={length} onChange={(event) => setLength(event.target.value)}>
                {LENGTHS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="tone">
                Tone
              </label>
              <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
                {TONES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Optimizing...' : 'Optimize Prompt'}
          </button>
        </form>

        <section className="panel output-panel" aria-live="polite">
          {!result && !isLoading && (
            <div className="empty-state">
              <h2>Your optimized prompt will appear here.</h2>
              <p>Choose a mode, add your rough idea, and PromptForge will shape it into a clearer AI prompt.</p>
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Forging a sharper prompt...</p>
            </div>
          )}

          {result && (
            <div className="result-card">
              <div className="result-header">
                <div>
                  <p className="eyebrow">Optimized Prompt</p>
                  <h2>Ready to use</h2>
                </div>
                <div className="score-badge">{result.score}/100</div>
              </div>

              <pre className="optimized-prompt">{result.optimizedPrompt}</pre>

              <button className="secondary-button" type="button" onClick={copyOptimizedPrompt}>
                {copied ? 'Copied!' : 'Copy Optimized Prompt'}
              </button>

              <div className="insights-grid">
                <InsightList title="Issues Found" items={result.issues} />
                <InsightList title="Improvements Made" items={result.improvements} />
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function InsightList({ title, items }) {
  return (
    <div className="insight-card">
      <h3>{title}</h3>
      <ul>
        {(items?.length ? items : ['None reported.']).map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
