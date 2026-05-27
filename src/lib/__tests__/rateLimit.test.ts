import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, clientIp, __resetRateLimit } from '@/lib/rateLimit';

describe('rateLimit (fixed window)', () => {
  beforeEach(() => __resetRateLimit());
  afterEach(() => vi.useRealTimers());

  it('allows up to the limit, then blocks', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('k', 5, 60_000).ok).toBe(true);
    }
    const blocked = rateLimit('k', 5, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('tracks separate keys independently', () => {
    expect(rateLimit('a', 1, 60_000).ok).toBe(true);
    expect(rateLimit('a', 1, 60_000).ok).toBe(false);
    // a different key (e.g. a different IP) still has its full budget
    expect(rateLimit('b', 1, 60_000).ok).toBe(true);
  });

  it('resets after the window elapses', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    expect(rateLimit('k', 1, 1_000).ok).toBe(true);
    expect(rateLimit('k', 1, 1_000).ok).toBe(false);
    vi.setSystemTime(1_001); // window expired
    expect(rateLimit('k', 1, 1_000).ok).toBe(true);
  });
});

describe('clientIp', () => {
  const reqWith = (headers: Record<string, string>) =>
    ({ headers: new Headers(headers) }) as unknown as Request;

  it('uses the first x-forwarded-for hop', () => {
    expect(clientIp(reqWith({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7');
  });

  it('falls back to x-real-ip', () => {
    expect(clientIp(reqWith({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4');
  });

  it('returns "unknown" when no client headers are present', () => {
    expect(clientIp(reqWith({}))).toBe('unknown');
  });
});
