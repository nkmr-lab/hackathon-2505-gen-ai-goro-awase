import { useState } from 'react';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const useLlm = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callLlm = async (prompt) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);

      const data = await res.json();
      const message = data.choices?.[0]?.message?.content || '';
      setResponse(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { callLlm, response, loading, error };
};
