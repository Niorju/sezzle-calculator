import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculate } from './api'

describe('calculate', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('returns result on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 15 }),
    } as Response)

    const result = await calculate({ a: 10, b: 5, operation: 'add' })
    expect(result).toBe(15)
    expect(fetch).toHaveBeenCalledWith(
      '/api/calculate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: 10, b: 5, operation: 'add' }),
      })
    )
  })

  it('throws on server error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'division by zero' }),
    } as Response)

    await expect(
      calculate({ a: 10, b: 0, operation: 'divide' })
    ).rejects.toThrow('division by zero')
  })

  it('throws on invalid response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    await expect(
      calculate({ a: 10, operation: 'sqrt' })
    ).rejects.toThrow('Invalid response')
  })
})
