const API_BASE = '/api'

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percent'

export interface CalculateRequest {
  a: number
  b?: number
  operation: Operation
}

export interface CalculateResponse {
  result?: number
  error?: string
}

export async function calculate(req: CalculateRequest): Promise<number> {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  const data: CalculateResponse = await res.json()

  if (!res.ok || data.error) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }

  if (data.result === undefined) {
    throw new Error('Invalid response from server')
  }

  return data.result
}
