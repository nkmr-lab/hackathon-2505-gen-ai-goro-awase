import { useState } from 'react';
import { useLlm } from '../hooks/use-llm';

function AskLlm() {
  const [prompt, setPrompt] = useState('');
  const { callLlm, response, loading, error } = useLlm();

  const handleSubmit = () => {
    if (prompt.trim()) {
      callLlm(prompt);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <h1>OpenAI API デモ</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '80%',
          maxWidth: '600px',
        }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ここにプロンプトを入力"
          rows={5}
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? '読み込み中...' : '送信'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}

      {response && (
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'left',
            width: '80%',
            maxWidth: '600px',
          }}
        >
          <h2>AIの返答:</h2>
          <pre
            style={{
              background: '#333',
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AskLlm;
