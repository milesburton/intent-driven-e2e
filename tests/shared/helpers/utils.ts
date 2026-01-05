export type Adapter = 'chromium' | 'openfin' | 'mock';

export function resolveAdapter(rawEnv?: string): Adapter {
  const raw = (rawEnv || process.env.APP_ADAPTER || '').toLowerCase();
  if (raw === 'openfin' || raw === 'mock') return raw as Adapter;
  return 'chromium';
}

export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { parseError: true };
  }
}
