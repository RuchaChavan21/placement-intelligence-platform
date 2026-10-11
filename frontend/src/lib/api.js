const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export class ChatError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // 'network' | 'server'
  }
}

/**
 * Ask the placement chatbot a question.
 * Resolves to { answer, citation, coverage, queryType }.
 */
export async function sendChatQuery(query) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/chatbot/chat?query=${encodeURIComponent(query)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new ChatError('network', "I couldn't reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new ChatError('server', `The server ran into a problem (error ${response.status}). Please try again in a moment.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!data.answer) {
    throw new ChatError('server', data.error || 'The server sent an empty answer. Please try again.');
  }

  return {
    answer: data.answer,
    citation: data.citation,
    coverage: data.coverage,
    queryType: data.query_type,
  };
}
