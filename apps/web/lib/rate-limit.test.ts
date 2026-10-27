import { describe, expect, it, beforeEach } from 'vitest';

import { clientIp, rateLimit, resetRateLimits } from './rate-limit';

const OPTIONS = { windowMs: 60_000, max: 3 };

describe('rateLimit', () => {
  beforeEach(() => resetRateLimits());

  it('permite hasta max hits dentro de la ventana', () => {
    expect(rateLimit('ip-a', OPTIONS, 1_000)).toBe(true);
    expect(rateLimit('ip-a', OPTIONS, 1_001)).toBe(true);
    expect(rateLimit('ip-a', OPTIONS, 1_002)).toBe(true);
    // Cuarto intento dentro de la ventana → bloqueado.
    expect(rateLimit('ip-a', OPTIONS, 1_003)).toBe(false);
  });

  it('la ventana se desliza: tras expirar vuelve a permitir', () => {
    expect(rateLimit('ip-b', OPTIONS, 1_000)).toBe(true);
    expect(rateLimit('ip-b', OPTIONS, 1_001)).toBe(true);
    expect(rateLimit('ip-b', OPTIONS, 1_002)).toBe(true);
    expect(rateLimit('ip-b', OPTIONS, 1_003)).toBe(false);

    // Fuera de la ventana (60s después del primer hit).
    expect(rateLimit('ip-b', OPTIONS, 61_001)).toBe(true);
  });

  it('las claves son independientes', () => {
    expect(rateLimit('ip-c', OPTIONS, 1_000)).toBe(true);
    expect(rateLimit('ip-c', OPTIONS, 1_001)).toBe(true);
    expect(rateLimit('ip-c', OPTIONS, 1_002)).toBe(true);
    expect(rateLimit('ip-c', OPTIONS, 1_003)).toBe(false);
    expect(rateLimit('ip-d', OPTIONS, 1_003)).toBe(true);
  });
});

describe('clientIp', () => {
  it('usa la primera IP de x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
    });
    expect(clientIp(request)).toBe('203.0.113.7');
  });

  it('usa x-real-ip como alternativa', () => {
    const request = new Request('http://localhost', { headers: { 'x-real-ip': '198.51.100.2' } });
    expect(clientIp(request)).toBe('198.51.100.2');
  });

  it('cae a local sin cabeceras', () => {
    expect(clientIp(new Request('http://localhost'))).toBe('local');
  });
});
