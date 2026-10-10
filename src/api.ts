export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<{ ok: boolean; data?: T; error?: string; [key: string]: any }> {
  try {
    const res = await fetch(`/api${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { ok: false, error: err.message || 'فشل الاتصال بالخادم' };
  }
}
